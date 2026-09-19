/**
 * Renders the brand-refresh boards with headless Chromium and captures them.
 *
 *   node branding/brand-refresh/scripts/capture-board.mjs            everything
 *   node branding/brand-refresh/scripts/capture-board.mjs hero       the 16:9 hero board only
 *   node branding/brand-refresh/scripts/capture-board.mjs full       the long board at 2400 px
 *   node branding/brand-refresh/scripts/capture-board.mjs details    all close-ups
 *   node branding/brand-refresh/scripts/capture-board.mjs wordmarks  one close-up by name
 *   node branding/brand-refresh/scripts/capture-board.mjs sections   compressed JPEG section exports
 *   node branding/brand-refresh/scripts/capture-board.mjs wordmark-o the arc-o variation board
 *   node branding/brand-refresh/scripts/capture-board.mjs wordmark-final the selected wordmark
 *
 * Outputs, all under captures/:
 *   hero.png, hero@2x.png         the 2400 × 1350 hero board at 1x and 2x
 *   board-full.png                the whole long board at 2400 px
 *   detail-*.png                  close-ups of the long board at 2x
 *   sections/*.jpg                the strongest long-board sections as compressed JPEGs
 *   wordmark-o.png                the arc-o variation board at 2x
 *   wordmark-final.png            the selected wordmark (B, 35°) at 2x
 */
import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LONG = resolve(HERE, '../brand-refresh.html');
const HERO = resolve(HERE, '../hero.html');
const WORDMARK_O = resolve(HERE, '../wordmark-o.html');
const WORDMARK_FINAL = resolve(HERE, '../wordmark-final.html');
const OUT = resolve(HERE, '../captures');
mkdirSync(join(OUT, 'sections'), { recursive: true });

const executablePath = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium/chrome-linux/chrome']
  .find((p) => existsSync(p));
const browser = await chromium.launch(executablePath ? { executablePath } : {});

const DETAILS = [
  ['masthead',  '.mast'],
  ['wordmarks', '.wm'],
  ['arc-motif', '.motif'],
  ['colour',    '.col'],
  ['real-ui',   '.ui'],
];
const SECTIONS = [
  ['01-masthead',   '.mast'],
  ['02-wordmark',   '.wm'],
  ['03-arc-motif',  '.motif'],
  ['04-colour',     '.col'],
];
const args = process.argv.slice(2);
const want = (k) => !args.length || args.includes(k);

const load = async (page, file) => {
  await page.goto(pathToFileURL(file).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
  if (await page.evaluate(() => 'ready' in document.body.dataset || document.querySelector('[data-prop]'))) {
    await page.waitForFunction(() => document.body.dataset.ready === '1').catch(() => {});
  }
  if (await page.evaluate(() => Boolean(document.querySelector('[data-arc-o]')))) {
    await page.waitForFunction(() => document.body.dataset.arcO === '1').catch(() => {});
  }
  await page.waitForTimeout(300);
};

const rectOf = (page, sel) => page.evaluate((s) => {
  const b = document.querySelector(s).getBoundingClientRect();
  return { x: b.left, y: b.top + window.scrollY, width: b.width, height: b.height };
}, sel);

// The 16:9 hero board.
if (want('hero')) {
  for (const [name, dsf] of [['hero.png', 1], ['hero@2x.png', 2]]) {
    const page = await browser.newPage({ viewport: { width: 2400, height: 1350 }, deviceScaleFactor: dsf });
    await load(page, HERO);
    await page.screenshot({ path: join(OUT, name), clip: { x: 0, y: 0, width: 2400, height: 1350 } });
    console.log(name, 2400 * dsf, 'x', 1350 * dsf);
    await page.close();
  }
}

// The arc-o variation board, 2x.
if (want('wordmark-o')) {
  const page = await browser.newPage({ viewport: { width: 2400, height: 1600 }, deviceScaleFactor: 2 });
  await load(page, WORDMARK_O);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.screenshot({ path: join(OUT, 'wordmark-o.png'), fullPage: true });
  console.log('wordmark-o.png', 4800, 'x', h * 2);
  await page.close();
}

// The final wordmark board, 2x.
if (want('wordmark-final')) {
  const page = await browser.newPage({ viewport: { width: 2400, height: 1600 }, deviceScaleFactor: 2 });
  await load(page, WORDMARK_FINAL);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.screenshot({ path: join(OUT, 'wordmark-final.png'), fullPage: true });
  console.log('wordmark-final.png', 4800, 'x', h * 2);
  await page.close();
}

// The long board, 1x.
if (want('full')) {
  const page = await browser.newPage({ viewport: { width: 2400, height: 1600 }, deviceScaleFactor: 1 });
  await load(page, LONG);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.screenshot({ path: join(OUT, 'board-full.png'), fullPage: true });
  console.log('board-full.png  2400 x', h);
  await page.close();
}

// Close-ups of the long board, 2x.
const detailNames = DETAILS.map(([n]) => n);
if (want('details') || args.some((a) => detailNames.includes(a))) {
  const page = await browser.newPage({ viewport: { width: 2400, height: 1600 }, deviceScaleFactor: 2 });
  await load(page, LONG);
  for (const [name, sel] of DETAILS) {
    if (args.length && !args.includes('details') && !args.includes(name)) continue;
    const r = await rectOf(page, sel);
    await page.screenshot({ path: join(OUT, `detail-${name}.png`), fullPage: true, clip: r });
    console.log(`detail-${name}.png`, Math.round(r.width * 2), 'x', Math.round(r.height * 2));
  }
  await page.close();
}

// Compressed section exports for the repository: 1.5x JPEG.
if (want('sections')) {
  const page = await browser.newPage({ viewport: { width: 2400, height: 1600 }, deviceScaleFactor: 1.5 });
  await load(page, LONG);
  for (const [name, sel] of SECTIONS) {
    const r = await rectOf(page, sel);
    await page.screenshot({ path: join(OUT, 'sections', `${name}.jpg`), type: 'jpeg', quality: 84, fullPage: true, clip: r });
    console.log(`sections/${name}.jpg`, Math.round(r.width * 1.5), 'x', Math.round(r.height * 1.5));
  }
  await page.close();
}

await browser.close();
