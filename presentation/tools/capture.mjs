/**
 * Presentation capture — pulls clean stills out of the FINAL built Storybook
 * and writes them into presentation/assets/.
 *
 * Nothing here touches the product. It serves the already-built
 * `storybook-static/` over http, opens each story in its own iframe (so no
 * Storybook sidebar, toolbar or addon panel is ever in frame) and screenshots
 * a single element. The application, the design system and the Storybook
 * config are read-only inputs.
 *
 *   Screens      the 390x844 `.screen` element, with the review device stage's
 *                status bar and home indicator already painted into it — the
 *                same safe-area presentation the project was reviewed at.
 *   Components   the story's own specimen frame. The story-only `Note`
 *                captions are dropped at capture time (in the page, not in the
 *                source) so the slide shows the component, not its annotation.
 *   Food         presentation-only crops of the approved photography, at the
 *                stylescape's own focal points and aspect ratios.
 *
 * Usage:  npm run build-storybook && node presentation/tools/capture.mjs
 */
import { chromium } from 'playwright';
import { statSync, createReadStream, existsSync, mkdirSync } from 'node:fs';
import http from 'node:http';
import { extname, join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../..');
const ROOT = join(REPO, 'storybook-static');
const OUT = join(REPO, 'presentation/assets');
const PORT = 4401;

if (!existsSync(join(ROOT, 'index.json'))) {
  console.error('No Storybook build found. Run `npm run build-storybook` first.');
  process.exit(1);
}

/* ---------------------------------------------------------------- targets */

/** Screens — the strongest final states, nothing from an earlier iteration. */
const SCREENS = [
  'screens-food-search--first-run',
  'screens-food-search--results',
  'screens-food-search--loading',
  'screens-food-search--no-results',
  'screens-food-search--camera-denied',
  'screens-nutrition-result--single-item',
  'screens-nutrition-result--portion-sheet',
  'screens-nutrition-result--incomplete-data',
  'screens-nutrition-result--error-state',
  'screens-nutrition-result--multi-item',
  'screens-recipe-discovery--browse',
  'screens-recipe-discovery--filters-applied',
  'screens-recipe-discovery--filter-sheet',
  'screens-recipe-discovery--offline',
  'screens-recipe-detail--full-recipe',
  'screens-recipe-detail--servings-adjusted',
];

/** Components — the curated set for the design system slide. */
const COMPONENTS = [
  ['button', 'actions-button--variants'],
  ['search-field', 'input-navigation-search-field--food-search'],
  ['filter-chip', 'input-navigation-filter-chip--active-filters'],
  ['segmented-control', 'input-navigation-segmented-control--portion-basis'],
  ['stepper', 'input-navigation-stepper--servings'],
  ['macro-group', 'nutrition-macro-group--default'],
  ['nutrition-summary', 'nutrition-nutrition-summary--summary'],
  ['recipe-card', 'food-recipe-recipe-card--long-title'],
  ['bottom-sheet', 'feedback-states-bottom-sheet--portion-sheet'],
  ['banner', 'feedback-states-banner--tones'],
  ['empty-state', 'feedback-states-empty-state--no-results'],
  ['skeleton', 'feedback-states-skeleton--recipe-cards'],
];

/**
 * Food crops for the branding slide. Focal points and aspect ratios are the
 * stylescape's own values (branding/stylescape.html, section 04) — this only
 * re-renders the approved crops at presentation size.
 */
const FOOD = [
  { name: 'hero-4x5', file: 'lentil-squash-bowl.png', w: 520, h: 650, op: '50% 50%', sc: 1 },
  { name: 'card-1x1', file: 'squash-couscous-bowl.png', w: 520, h: 520, op: '50% 50%', sc: 1 },
  { name: 'circle-bleed', file: 'chickpea-bowl.png', w: 520, h: 520, op: '58% 59%', sc: 1.2 },
  { name: 'detail-1x1', file: 'roasted-lentils-detail.png', w: 520, h: 520, op: '50% 50%', sc: 1 },
];

/* ----------------------------------------------------------------- server */

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
const base = `http://127.0.0.1:${PORT}`;

/* ---------------------------------------------------------------- browser */

const executablePath = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium/chrome-linux/chrome']
  .find((p) => existsSync(p));
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: 1100, height: 1200 }, deviceScaleFactor: 2 });

for (const d of ['screens', 'components', 'food']) mkdirSync(join(OUT, d), { recursive: true });

/** Storybook's screens lazy-load their photography; a still has to wait for it. */
const settle = async () => {
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = 'eager';
    await Promise.all([...document.images].map((i) => (i.complete ? null : i.decode().catch(() => {}))));
    await document.fonts.ready;
  });
  await page.waitForTimeout(220);
};

const shoot = async (id, selector, out, { stripNotes = false } = {}) => {
  await page.goto(`${base}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle' });
  const rendered = await page.evaluate(() => document.body.classList.contains('sb-show-main'));
  if (!rendered) throw new Error(`${id} did not render`);
  if (stripNotes) {
    // `Note` is the story-only caption from src/lib/Frame.jsx. It is identified
    // by its inline font/colour declaration, and removed in the page only.
    await page.evaluate(() => {
      for (const p of document.querySelectorAll('p[style]')) {
        if (p.getAttribute('style').includes('--ds-ink-2') && p.getAttribute('style').includes('--ds-font-ui')) p.remove();
      }
    });
  }
  await settle();
  const el = await page.$(selector);
  if (!el) throw new Error(`${id}: no element matching ${selector}`);
  await el.screenshot({ path: out });
  console.log(`  ${out.replace(REPO + '/', '')}`);
};

const ONLY = process.argv[2]; // 'screens' | 'components' | 'food', or nothing for all

if (!ONLY || ONLY === 'screens') {
console.log(`\nScreens (${SCREENS.length})`);
for (const id of SCREENS) {
  await shoot(id, '.sb-device .screen', join(OUT, 'screens', `${id.replace('screens-', '')}.png`));
}
}

if (!ONLY || ONLY === 'components') {
console.log(`\nComponents (${COMPONENTS.length})`);
for (const [name, id] of COMPONENTS) {
  // Bottom Sheet renders on its own 390px stage rather than inside `Frame`.
  const selector = name === 'bottom-sheet' ? '#storybook-root > div > div' : '.ds-frame';
  await shoot(id, selector, join(OUT, 'components', `${name}.png`), { stripNotes: true });
}
}

if (!ONLY || ONLY === 'food') {
console.log(`\nFood crops (${FOOD.length})`);
for (const f of FOOD) {
  await page.setViewportSize({ width: f.w + 40, height: f.h + 40 });
  await page.goto(`${base}/iframe.html`, { waitUntil: 'domcontentloaded' });
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#FBFAF8">
    <div id="crop" style="width:${f.w}px;height:${f.h}px;overflow:hidden">
      <img src="${base}/food/${f.file}" style="width:100%;height:100%;object-fit:cover;
           object-position:${f.op};transform-origin:${f.op};transform:scale(${f.sc});display:block">
    </div></body></html>`, { waitUntil: 'networkidle' });
  await settle();
  const el = await page.$('#crop');
  const out = join(OUT, 'food', `${f.name}.jpg`);
  await el.screenshot({ path: out, type: 'jpeg', quality: 88 });
  console.log(`  ${out.replace(REPO + '/', '')}`);
}
}

await browser.close();
server.close();
console.log('\nDone.\n');
