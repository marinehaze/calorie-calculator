/**
 * Screen-fidelity verification.
 *
 * A slide can pass an overflow check and still be showing a screenshot that is
 * visually cut off, so this checks the thing that actually matters: for every
 * mobile screen instance in the deck, is the captured viewport displayed
 * WHOLE?
 *
 * For each `.phone img` it reports:
 *
 *   source        the PNG's own pixel size — must be 780 x 1688, i.e. a full
 *                 390 x 844 application viewport at 2x
 *   fit           the computed object-fit — `cover` would crop, so it fails
 *   rendered      the image's laid-out box
 *   visible       that box intersected with every clipping ancestor
 *   bottom        whether the bottom edge of the image is inside the visible
 *                 area, to 0.5px
 *
 * A capture taken from a scrolled application is NOT a crop: the viewport is
 * still whole, the application simply scrolled inside it before the shutter.
 * Those are reported as an intentional scrolled state, read from the file name.
 *
 * Usage:  node presentation/tools/verify-screens.mjs
 */
import { chromium } from 'playwright';
import { statSync, createReadStream, existsSync } from 'node:fs';
import http from 'node:http';
import { extname, join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const PORT = 4404;
const EXPECT = { w: 780, h: 1688 };

const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
};
const server = http.createServer((req, res) => {
  let file = join(ROOT, normalize(decodeURIComponent(req.url.split('?')[0].split('#')[0])));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  try { if (statSync(file).isDirectory()) file = join(file, 'index.html'); } catch { res.writeHead(404); return res.end(); }
  try { statSync(file); } catch { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));

const executablePath = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium/chrome-linux/chrome']
  .find((p) => existsSync(p));
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
const rows = [];

for (let i = 1; i <= total; i++) {
  await page.evaluate((n) => { location.hash = String(n); }, i);
  await page.waitForTimeout(420);
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = 'eager';
    await Promise.all([...document.images].map((x) => (x.complete ? null : x.decode().catch(() => {}))));
  });

  const found = await page.evaluate(() => {
    const active = document.querySelector('.slide[data-active]');
    return [...active.querySelectorAll('.phone img')].map((img) => {
      const r = img.getBoundingClientRect();
      // Intersect with every ancestor that clips, up to and including the stage.
      let box = { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
      for (let a = img.parentElement; a; a = a.parentElement) {
        if (getComputedStyle(a).overflow === 'visible') continue;
        const ar = a.getBoundingClientRect();
        box = {
          top: Math.max(box.top, ar.top), bottom: Math.min(box.bottom, ar.bottom),
          left: Math.max(box.left, ar.left), right: Math.min(box.right, ar.right),
        };
      }
      return {
        src: img.getAttribute('src').split('/').pop(),
        natW: img.naturalWidth, natH: img.naturalHeight,
        fit: getComputedStyle(img).objectFit,
        w: +r.width.toFixed(1), h: +r.height.toFixed(1),
        cutBottom: +(r.bottom - box.bottom).toFixed(1),
        cutTop: +(box.top - r.top).toFixed(1),
        cutSide: +Math.max(box.left - r.left, r.right - box.right).toFixed(1),
      };
    });
  });

  for (const f of found) rows.push({ slide: i, ...f });
}

await browser.close();
server.close();

/* --------------------------------------------------------------- report */

const name = (src) => src
  .replace(/\.png$/, '')
  .replace('--scrolled', ' · scrolled state')
  .replace('--', ' · ')
  .replace(/-/g, ' ');

let fails = 0;
console.log(`\nScreen-fidelity check — every .phone instance in the deck\n`);
console.log('Slide  Screen / state                                  Source      Fit      Rendered     Bottom visible');
console.log('-'.repeat(112));

for (const r of rows) {
  const sourceOk = r.natW === EXPECT.w && r.natH === EXPECT.h;
  const fitOk = r.fit === 'contain' || r.fit === 'fill';
  const whole = r.cutBottom <= 0.5 && r.cutTop <= 0.5 && r.cutSide <= 0.5;
  // With a whole source and `contain`, the laid-out box must keep 390:844.
  const ratioOk = Math.abs((r.w / r.h) - (390 / 844)) < 0.005;
  const ok = sourceOk && fitOk && whole && ratioOk;
  if (!ok) fails++;

  const verdict = whole
    ? (r.src.includes('--scrolled') ? 'YES  (intentional scrolled state)' : 'YES')
    : `NO  — ACCIDENTAL CROP, ${r.cutBottom}px cut from the bottom`;

  console.log(
    `  ${String(r.slide).padEnd(5)}${name(r.src).padEnd(48)}` +
    `${(r.natW + 'x' + r.natH).padEnd(12)}${r.fit.padEnd(9)}` +
    `${(r.w + 'x' + r.h).padEnd(13)}${verdict}`
  );
  if (!sourceOk) console.log(`         ^ source is not ${EXPECT.w}x${EXPECT.h}`);
  if (!ratioOk) console.log(`         ^ rendered box is not 390:844`);
}

const scrolled = rows.filter((r) => r.src.includes('--scrolled')).length;
console.log('-'.repeat(112));
console.log(`\n  ${rows.length} screen instances across slides ${[...new Set(rows.map((r) => r.slide))].join(', ')}`);
console.log(`  ${rows.length - scrolled} top-state captures, ${scrolled} intentional scrolled-state captures`);
console.log(`  accidental bottom crops: ${fails}`);
console.log(fails === 0 ? '\n  PASS — every captured viewport is displayed whole.\n' : '\n  FAIL\n');
process.exit(fails === 0 ? 0 : 1);
