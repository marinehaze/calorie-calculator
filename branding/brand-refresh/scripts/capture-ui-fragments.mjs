/**
 * Captures real product UI fragments from the built Storybook for the
 * brand-refresh board. Nothing is redesigned: these are 2x screenshots of the
 * approved screens, clipped to the fragment the board needs.
 *
 * Usage (from the repo root):
 *   npm run build-storybook
 *   node branding/brand-refresh/scripts/capture-ui-fragments.mjs
 */
import { chromium } from 'playwright';
import { statSync, createReadStream, existsSync, mkdirSync } from 'node:fs';
import http from 'node:http';
import { extname, join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../../../storybook-static');
const OUT = resolve(HERE, '../assets/ui');
const PORT = 4398;
mkdirSync(OUT, { recursive: true });

if (!existsSync(join(ROOT, 'index.json'))) {
  console.error('No Storybook build found. Run `npm run build-storybook` first.');
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
};
const server = http.createServer((req, res) => {
  let file = join(ROOT, normalize(decodeURIComponent(req.url.split('?')[0])));
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
const page = await browser.newPage({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 2 });

const STATUS_BAR = 47; // simulated top inset painted by the review stage

/** Rect helper evaluated in the page: `sel` → DOMRect of the nth match. */
const rect = (sel, n = 0) => page.evaluate(([s, i]) => {
  const el = document.querySelectorAll(s)[i];
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height, bottom: r.bottom };
}, [sel, n]);

const open = async (id) => {
  await page.goto(`http://127.0.0.1:${PORT}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
};

const shot = async (name, clip) => {
  await page.screenshot({ path: join(OUT, `${name}.png`), clip: { x: Math.round(clip.x), y: Math.round(clip.y), width: Math.round(clip.width), height: Math.round(clip.height) } });
  console.log('captured', name, Math.round(clip.width), 'x', Math.round(clip.height));
};

// 1. Nutrition Result — the hero hierarchy: bleed crop, name, calories, pair.
await open('screens-nutrition-result--single-item');
{
  const screen = await rect('.screen');
  const pair = await rect('.nr-pair');
  const top = screen.y + STATUS_BAR;
  await shot('nutrition-hero', { x: screen.x, y: top, width: 390, height: pair.bottom - top + 24 });

  // 2. The macro row with the Portion / Per 100 g switch. The section sits
  //    under the pinned action band at rest, so scroll it up into view first.
  await page.evaluate(() => {
    const scroller = document.querySelector('.screen__scroll');
    const nut = document.querySelector('.nr-nutrition');
    scroller.scrollTop = nut.offsetTop - 96;
  });
  await page.waitForTimeout(150);
  const nut = await rect('.nr-nutrition');
  await shot('macro-row', { x: screen.x, y: nut.y - 8, width: 390, height: nut.h + 16 });
}

// 3. Food Search — the search field and the first three result rows.
await open('screens-food-search--results');
{
  const screen = await rect('.screen');
  const row3 = await rect('.ds-food-result-row', 2);
  const top = screen.y + STATUS_BAR;
  await shot('search-results', { x: screen.x, y: top, width: 390, height: row3.bottom - top });
}

// 4. The portion sheet — portion control, live result behind it.
await open('screens-nutrition-result--portion-sheet');
{
  const screen = await rect('.screen');
  const sheet = await rect('.ds-sheet');
  await shot('portion-sheet', { x: screen.x, y: sheet.y, width: 390, height: Math.min(sheet.h, screen.bottom - sheet.y) });
}

await browser.close();
server.close();
