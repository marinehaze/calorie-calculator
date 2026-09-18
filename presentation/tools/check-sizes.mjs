/**
 * Resolution check — loads the deck at the laptop sizes it is likely to be
 * presented and recorded at, and confirms the stage still holds 16:9, still
 * fits the window, and still never scrolls. Also loads it straight off the
 * filesystem (file://), the way it opens on a double-click.
 *
 * Usage:  node presentation/tools/check-sizes.mjs
 */
import { chromium } from 'playwright';
import { statSync, createReadStream, existsSync, mkdirSync } from 'node:fs';
import http from 'node:http';
import { extname, join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const OUT = join(ROOT, '.review');
const PORT = 4403;

const SIZES = [
  [1280, 800, 'MacBook Air 13 (scaled)'],
  [1366, 768, '1366 x 768 laptop'],
  [1440, 900, 'MacBook Air / Pro 14 (scaled)'],
  [1512, 982, 'MacBook Pro 14 (default)'],
  [1600, 900, 'deck design size'],
  [1728, 1117, 'MacBook Pro 16 (default)'],
  [1920, 1080, '1080p display'],
  [2560, 1440, '1440p display'],
];

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
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
mkdirSync(OUT, { recursive: true });

const problems = [];
console.log('\nviewport        scale   rendered stage        ratio    scrolls');
console.log('-'.repeat(68));

for (const [w, h, label] of SIZES) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`http://127.0.0.1:${PORT}/index.html#5`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const r = await page.evaluate(() => {
    const b = document.querySelector('.stage').getBoundingClientRect();
    return {
      k: Number(getComputedStyle(document.querySelector('.stage')).getPropertyValue('--k')),
      w: Math.round(b.width), h: Math.round(b.height),
      scrolls: document.documentElement.scrollHeight > window.innerHeight + 1
            || document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });

  const ratio = r.w / r.h;
  const fits = r.w <= w + 1 && r.h <= h + 1;
  if (Math.abs(ratio - 16 / 9) > 0.005) problems.push(`${w}x${h}: stage is ${ratio.toFixed(3)}, not 16:9`);
  if (!fits) problems.push(`${w}x${h}: stage (${r.w}x${r.h}) does not fit the window`);
  if (r.scrolls) problems.push(`${w}x${h}: the page scrolls`);

  console.log(`${String(w + 'x' + h).padEnd(15)} ${r.k.toFixed(3)}   ${String(r.w + ' x ' + r.h).padEnd(20)} ${ratio.toFixed(3)}    ${r.scrolls ? 'YES' : 'no'}   ${label}`);
  if (w === 1366 || w === 1920) await page.screenshot({ path: join(OUT, `size-${w}x${h}.png`) });
  await page.close();
}

// And straight off disk, with no server at all.
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const missing = [];
page.on('requestfailed', (r) => missing.push(r.url().split('/').pop()));
await page.goto(`file://${join(ROOT, 'index.html')}`, { waitUntil: 'load' });
await page.waitForTimeout(700);
const local = await page.evaluate(() => ({
  fonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family),
  slides: document.querySelectorAll('.slide').length,
  images: [...document.images].filter((i) => i.naturalWidth === 0).length,
}));
console.log(`\nfile:// — ${local.slides} slides, ${local.images} broken image(s), fonts loaded: ${[...new Set(local.fonts)].join(', ') || 'none'}`);
if (local.images) problems.push(`file://: ${local.images} image(s) failed to load`);
if (missing.length) problems.push(`file://: failed requests — ${[...new Set(missing)].join(', ')}`);
await page.screenshot({ path: join(OUT, 'file-protocol.png') });
await page.close();

await browser.close();
server.close();

console.log(`\n=== PROBLEMS (${problems.length}) ===`);
if (!problems.length) console.log('  none');
else [...new Set(problems)].forEach((p) => console.log(`  ${p}`));
console.log();
process.exit(problems.length ? 1 : 0);
