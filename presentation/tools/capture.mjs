/**
 * Screen capture — pulls clean stills out of the FINAL built Storybook and
 * writes them into presentation/assets/ and the reviewer-facing screens/.
 *
 * Nothing here touches the product. It serves the already-built
 * `storybook-static/` over http, opens each story in its own iframe (so no
 * Storybook sidebar, toolbar or addon panel is ever in frame) and screenshots
 * the browser viewport. The application, the design system and the Storybook
 * config are read-only inputs.
 *
 *   Screens      a true 390 x 844 CSS viewport at deviceScaleFactor 2, so every
 *                PNG is exactly 780 x 1688 and holds the whole application
 *                viewport — never a crop of a taller image. The review device
 *                stage's own padding and drop shadow are switched off in the
 *                page at capture time so the screen sits flush in the viewport;
 *                its status bar, safe areas and home indicator stay, because
 *                that is the project's approved screen presentation.
 *   Components   the story's own specimen frame, for the design system slide.
 *                The story-only `Note` captions are dropped at capture time
 *                (in the page, not in the source).
 *   Food         presentation-only crops of the approved photography, at the
 *                stylescape's own focal points and aspect ratios.
 *
 * Long screens are captured twice — a top state and a scrolled state — rather
 * than cropped once. A scrolled capture is still a whole 390 x 844 viewport:
 * the application is scrolled, the screenshot is not trimmed.
 *
 * Usage:  npm run build-storybook
 *         node presentation/tools/capture.mjs [screens|components|food]
 */
import { chromium } from 'playwright';
import { statSync, createReadStream, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import http from 'node:http';
import { extname, join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../..');
const ROOT = join(REPO, 'storybook-static');
const OUT = join(REPO, 'presentation/assets');
const DELIVERY = join(REPO, 'screens');
const PORT = 4401;

/** The one capture geometry. Every screen PNG is this viewport at 2x. */
const VIEWPORT = { width: 390, height: 844 };
const SCALE = 2;

if (!existsSync(join(ROOT, 'index.json'))) {
  console.error('No Storybook build found. Run `npm run build-storybook` first.');
  process.exit(1);
}

/* ---------------------------------------------------------------- targets */

/**
 * Screens. `scrollTo` marks a deliberate scrolled capture: the screen's own
 * scroll container is scrolled until that element sits `offset` px below the
 * top of the screen, and the whole viewport is then captured. `deliver` is the
 * filename this screen takes in the root screens/ folder, when reviewers
 * should have it.
 */
const SCREENS = [
  { id: 'screens-food-search--first-run', file: 'food-search--first-run', deliver: 'food-search-first-run' },
  { id: 'screens-food-search--results', file: 'food-search--results', deliver: 'food-search' },
  { id: 'screens-food-search--loading', file: 'food-search--loading', deliver: 'search-loading' },
  { id: 'screens-food-search--no-results', file: 'food-search--no-results', deliver: 'search-no-results' },
  { id: 'screens-food-search--camera-denied', file: 'food-search--camera-denied', deliver: 'camera-access-off' },

  { id: 'screens-nutrition-result--single-item', file: 'nutrition-result--single-item', deliver: 'nutrition-result-top' },
  { id: 'screens-nutrition-result--single-item', file: 'nutrition-result--single-item--scrolled', deliver: 'nutrition-result-scrolled',
    scrollTo: '.nr-pair', offset: 58 },
  { id: 'screens-nutrition-result--portion-sheet', file: 'nutrition-result--portion-sheet', deliver: 'nutrition-result-portion-sheet' },
  { id: 'screens-nutrition-result--multi-item', file: 'nutrition-result--multi-item--scrolled', deliver: null,
    scrollTo: '.nr-pair', offset: 58 },
  { id: 'screens-nutrition-result--incomplete-data', file: 'nutrition-result--incomplete-data', deliver: 'nutrition-result-incomplete' },
  // Delivery only: slide 7 shows five whole screens, and Offline already
  // carries the Banner-and-retry pattern this state repeats.
  { id: 'screens-nutrition-result--error-state', file: null, deliver: 'nutrition-result-error' },

  { id: 'screens-recipe-discovery--browse', file: 'recipe-discovery--browse', deliver: 'recipe-discovery' },
  { id: 'screens-recipe-discovery--filter-sheet', file: 'recipe-discovery--filter-sheet', deliver: 'recipe-discovery-filters' },
  { id: 'screens-recipe-discovery--filters-applied', file: 'recipe-discovery--filters-applied', deliver: null },
  { id: 'screens-recipe-discovery--offline', file: 'recipe-discovery--offline', deliver: 'offline' },

  { id: 'screens-recipe-detail--full-recipe', file: 'recipe-detail--full-recipe', deliver: 'recipe-detail-top' },
  { id: 'screens-recipe-detail--full-recipe', file: 'recipe-detail--full-recipe--scrolled', deliver: 'recipe-detail-scrolled',
    scrollTo: '.ds-nutrition', offset: 96 },
  { id: 'screens-recipe-detail--servings-adjusted', file: 'recipe-detail--servings-adjusted--scrolled', deliver: null,
    scrollTo: '.ds-nutrition', offset: 96 },
];

/** Components — the curated set for the design system slide. */
const COMPONENTS = [
  ['button', 'actions-button--variants'],
  ['search-field', 'input-navigation-search-field--food-search'],
  ['filter-chip', 'input-navigation-filter-chip--active-filters'],
  ['segmented-control', 'input-navigation-segmented-control--portion-basis'],
  ['stepper', 'input-navigation-stepper--servings'],
  ['macro-group', 'nutrition-macro-group--default'],
  ['macro-energy-split', 'nutrition-macro-energy-split--complete'],
  ['nutrition-summary', 'nutrition-nutrition-summary--summary'],
  ['recipe-card', 'food-recipe-recipe-card--long-title'],
  ['bottom-sheet', 'feedback-states-bottom-sheet--portion-sheet'],
  ['banner', 'feedback-states-banner--tones'],
  ['empty-state', 'feedback-states-empty-state--no-results'],
  ['skeleton', 'feedback-states-skeleton--recipe-cards'],
];

/**
 * Food crops for the brand slide. Focal points and aspect ratios are the
 * stylescape's own values (branding/brand-refresh, section 04) — this only
 * re-renders the approved crops at presentation size.
 */
const FOOD = [
  { name: 'card-1x1', file: 'squash-couscous-bowl.png', w: 520, h: 520, op: '50% 50%', sc: 1 },
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

const ONLY = process.argv[2];
for (const d of ['screens', 'components', 'food']) mkdirSync(join(OUT, d), { recursive: true });
mkdirSync(DELIVERY, { recursive: true });

/** Storybook's screens lazy-load their photography; a still has to wait for it. */
const settle = async (page) => {
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = 'eager';
    await Promise.all([...document.images].map((i) => (i.complete ? null : i.decode().catch(() => {}))));
    await document.fonts.ready;
  });
  await page.waitForTimeout(220);
};

const rel = (p) => p.replace(REPO + '/', '');

/* ------------------------------------------------------------ 1. screens */

if (!ONLY || ONLY === 'screens') {
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: SCALE });
  console.log(`\nScreens (${SCREENS.length}) — ${VIEWPORT.width}x${VIEWPORT.height} viewport at ${SCALE}x`);

  for (const t of SCREENS) {
    await page.goto(`${base}/iframe.html?id=${t.id}&viewMode=story`, { waitUntil: 'networkidle' });
    if (!(await page.evaluate(() => document.body.classList.contains('sb-show-main')))) {
      throw new Error(`${t.id} did not render`);
    }

    // The review device stage centres the screen on a coloured ground with a
    // drop shadow, which is right for reviewing in Storybook and wrong for an
    // exported viewport. Switch both off in the page; the status bar, safe
    // areas and home indicator are part of the screen and stay.
    await page.addStyleTag({ content: `
      html, body { margin: 0 !important; padding: 0 !important; background: transparent !important; overflow: hidden !important; }
      .sb-device { padding: 0 !important; background: transparent !important; }
      .sb-device .screen { box-shadow: none !important; }
    ` });
    await settle(page);

    if (t.scrollTo) {
      const moved = await page.evaluate(({ sel, offset }) => {
        const target = document.querySelector(sel);
        const scroller = document.querySelector('.screen__scroll');
        const screen = document.querySelector('.screen');
        if (!target || !scroller || !screen) return null;
        scroller.scrollTop += target.getBoundingClientRect().top - screen.getBoundingClientRect().top - offset;
        return Math.round(scroller.scrollTop);
      }, { sel: t.scrollTo, offset: t.offset });
      if (moved === null) throw new Error(`${t.id}: nothing matching ${t.scrollTo} to scroll to`);
      await page.waitForTimeout(160);
    }

    // The viewport itself — not an element, and not a full-page shot.
    const out = t.file ? join(OUT, 'screens', `${t.file}.png`)
                       : join(DELIVERY, `${t.deliver}.png`);
    await page.screenshot({ path: out });
    console.log(`  ${rel(out)}${t.scrollTo ? '  (scrolled)' : ''}`);

    if (t.file && t.deliver) {
      const dest = join(DELIVERY, `${t.deliver}.png`);
      copyFileSync(out, dest);
      console.log(`     -> ${rel(dest)}`);
    }
  }
  await page.close();
}

/* --------------------------------------------------------- 2. components */

if (!ONLY || ONLY === 'components') {
  const page = await browser.newPage({ viewport: { width: 1100, height: 1200 }, deviceScaleFactor: SCALE });
  console.log(`\nComponents (${COMPONENTS.length})`);

  for (const [name, id] of COMPONENTS) {
    await page.goto(`${base}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle' });
    if (!(await page.evaluate(() => document.body.classList.contains('sb-show-main')))) {
      throw new Error(`${id} did not render`);
    }
    // `Note` is the story-only caption from src/lib/Frame.jsx, identified by
    // its inline font/colour declaration and removed in the page only.
    await page.evaluate(() => {
      for (const p of document.querySelectorAll('p[style]')) {
        const s = p.getAttribute('style');
        if (s.includes('--ds-ink-2') && s.includes('--ds-font-ui')) p.remove();
      }
    });
    await settle(page);

    // Bottom Sheet renders on its own 390px stage rather than inside `Frame`.
    const selector = name === 'bottom-sheet' ? '#storybook-root > div > div' : '.ds-frame';
    const el = await page.$(selector);
    if (!el) throw new Error(`${id}: no element matching ${selector}`);
    const out = join(OUT, 'components', `${name}.png`);
    await el.screenshot({ path: out });
    console.log(`  ${rel(out)}`);
  }
  await page.close();
}

/* --------------------------------------------------------------- 3. food */

if (!ONLY || ONLY === 'food') {
  const page = await browser.newPage({ deviceScaleFactor: SCALE });
  console.log(`\nFood crops (${FOOD.length})`);

  for (const f of FOOD) {
    await page.setViewportSize({ width: f.w + 40, height: f.h + 40 });
    await page.goto(`${base}/iframe.html`, { waitUntil: 'domcontentloaded' });
    await page.setContent(`<!doctype html><html><body style="margin:0;background:#FBFAF8">
      <div id="crop" style="width:${f.w}px;height:${f.h}px;overflow:hidden">
        <img src="${base}/food/${f.file}" style="width:100%;height:100%;object-fit:cover;
             object-position:${f.op};transform-origin:${f.op};transform:scale(${f.sc});display:block">
      </div></body></html>`, { waitUntil: 'networkidle' });
    await settle(page);
    const out = join(OUT, 'food', `${f.name}.jpg`);
    await (await page.$('#crop')).screenshot({ path: out, type: 'jpeg', quality: 88 });
    console.log(`  ${rel(out)}`);
  }
  await page.close();
}

await browser.close();
server.close();
console.log('\nDone.\n');
