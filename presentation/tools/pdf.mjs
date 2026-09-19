/**
 * PDF fallback — renders the live eight-slide deck to
 * presentation/piatto-case.pdf, one slide per page at the deck's own
 * 1600 x 900.
 *
 * This prints the real presentation, not the contact sheet and not a stack of
 * screenshots: the print block in styles.css unscales the stage and gives each
 * slide a page, so the type stays type and the two local families embed.
 *
 * Usage:  node presentation/tools/pdf.mjs
 */
import { chromium } from 'playwright';
import { statSync, createReadStream, existsSync, statSync as stat } from 'node:fs';
import http from 'node:http';
import { extname, join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const OUT = join(ROOT, 'piatto-case.pdf');
const PORT = 4405;

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

const missing = [];
page.on('requestfailed', (r) => missing.push(r.url()));
page.on('response', (r) => { if (r.status() >= 400) missing.push(`${r.status()} ${r.url()}`); });

await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

const slides = await page.evaluate(() => document.querySelectorAll('.slide').length);

// Every image, on every slide — not just the active one — has to be decoded
// before the print, or a lazy image prints as a gap.
await page.evaluate(async () => {
  for (const img of document.images) { img.loading = 'eager'; img.decoding = 'sync'; }
  await Promise.all([...document.images].map((i) => (i.complete && i.naturalWidth ? null : i.decode().catch(() => {}))));
  await document.fonts.ready;
});
const broken = await page.evaluate(() =>
  [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute('src')));
await page.waitForTimeout(500);

await page.pdf({
  path: OUT,
  width: '1600px',
  height: '900px',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
});

await browser.close();
server.close();

const size = stat(OUT).size;
console.log(`\n  ${OUT.replace(resolve(ROOT, '..') + '/', '')}`);
console.log(`  slides in the deck: ${slides}`);
console.log(`  images that failed to decode: ${broken.length}${broken.length ? ' — ' + broken.join(', ') : ''}`);
console.log(`  failed requests: ${missing.length}${missing.length ? ' — ' + missing.join(', ') : ''}`);
console.log(`  file size: ${(size / 1024 / 1024).toFixed(2)} MB\n`);
process.exit(broken.length || missing.length ? 1 : 0);
