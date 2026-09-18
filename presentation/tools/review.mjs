/**
 * Presentation review — opens the deck in a real browser at a 16:9 viewport,
 * drives it with the keyboard, and writes out one still per slide plus a
 * contact sheet of all eight.
 *
 * It also reports anything the deck must not do: a slide taller or wider than
 * the stage, an asset that failed to load, or a console error.
 *
 * Usage:  node presentation/tools/review.mjs [width] [height]
 */
import { chromium } from 'playwright';
import { statSync, createReadStream, existsSync, mkdirSync } from 'node:fs';
import http from 'node:http';
import { extname, join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const OUT = join(ROOT, '.review');
const PORT = 4402;
const W = Number(process.argv[2] || 1600);
const H = Number(process.argv[3] || 900);

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
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });

const problems = [];
page.on('console', (m) => { if (m.type() === 'error') problems.push(`console: ${m.text()} [${m.location().url}]`); });
page.on('pageerror', (e) => problems.push(`pageerror: ${e}`));
page.on('requestfailed', (r) => problems.push(`asset failed: ${r.url()}`));
page.on('response', (r) => { if (r.status() >= 400) problems.push(`HTTP ${r.status()}: ${r.url()}`); });
page.on('request', (r) => { if (r.url().endsWith('/favicon.ico')) seenFavicon = true; });
let seenFavicon = false;

mkdirSync(OUT, { recursive: true });
await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
console.log(`\nDeck: ${total} slides, reviewed at ${W}x${H} (device pixel ratio 2).\n`);

for (let i = 1; i <= total; i++) {
  if (i > 1) await page.keyboard.press(i % 2 ? 'Space' : 'ArrowRight'); // exercise both keys
  await page.waitForTimeout(460);
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = 'eager';
    await Promise.all([...document.images].map((x) => (x.complete ? null : x.decode().catch(() => {}))));
  });

  const state = await page.evaluate(() => {
    const active = document.querySelector('.slide[data-active]');
    const all = [...document.querySelectorAll('.slide')];
    const stage = document.querySelector('.stage').getBoundingClientRect();
    // Does anything on this slide reach past the 1600x900 stage?
    const over = [];
    for (const el of active.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      // An element deliberately clipped by an ancestor still reports its full
      // box, so it is not evidence that anything reaches past the stage.
      let clipped = false;
      for (let a = el.parentElement; a && a !== active.parentElement; a = a.parentElement) {
        if (getComputedStyle(a).overflow !== 'visible') { clipped = true; break; }
      }
      if (clipped) continue;
      if (r.bottom > stage.bottom + 1 || r.top < stage.top - 1 || r.right > stage.right + 1 || r.left < stage.left - 1) {
        over.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`);
      }
    }
    return {
      n: all.indexOf(active) + 1,
      label: active.getAttribute('aria-label'),
      pager: document.querySelector('.pager').textContent.trim(),
      hash: location.hash,
      scrolled: document.documentElement.scrollHeight > window.innerHeight || document.documentElement.scrollWidth > window.innerWidth,
      over: [...new Set(over)],
    };
  });

  if (state.n !== i) problems.push(`slide ${i}: keyboard advance landed on ${state.n}`);
  if (state.over.length) problems.push(`slide ${i}: content past the stage — ${state.over.join(', ')}`);
  if (state.scrolled) problems.push(`slide ${i}: the page scrolls`);

  await page.screenshot({ path: join(OUT, `slide-${String(i).padStart(2, '0')}.png`) });
  console.log(`  ${String(i).padStart(2, '0')}  ${state.label.replace(/^Slide \d+: /, '').padEnd(34)} pager ${state.pager}  ${state.hash}`);
}

// Back-navigation, then the contact sheet.
await page.keyboard.press('ArrowLeft');
await page.waitForTimeout(400);
const back = await page.evaluate(() => document.querySelector('.pager').textContent.trim());
if (!back.startsWith('07')) problems.push(`ArrowLeft from slide 8 landed on ${back}`);
console.log(`\n  ArrowLeft from 08 → ${back}`);

await page.setViewportSize({ width: 1640, height: 1120 });
await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
await page.setContent(`<!doctype html><html><body style="margin:0;background:#FBFAF8;
  font:500 11px/1 -apple-system,Helvetica,Arial,sans-serif;color:#6B6863">
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:22px;padding:22px">
  ${Array.from({ length: total }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    return `<figure style="margin:0"><img src="http://127.0.0.1:${PORT}/.review/slide-${n}.png"
      style="width:100%;display:block;box-shadow:0 0 0 1px rgba(28,27,25,.12)"><figcaption
      style="padding-top:7px">${n}</figcaption></figure>`;
  }).join('')}
  </div></body></html>`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({ path: join(OUT, 'contact-sheet.png'), fullPage: true });

await browser.close();
server.close();

console.log(`\n=== PROBLEMS (${problems.length}) ===`);
if (!problems.length) console.log('  none');
else [...new Set(problems)].forEach((p) => console.log(`  ${p}`));
console.log(`\nStills: presentation/.review/\n`);
process.exit(problems.length ? 1 : 0);
