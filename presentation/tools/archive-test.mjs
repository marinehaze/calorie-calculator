/**
 * Clean-archive test.
 *
 * Opens the deck the way a reviewer actually gets it: packaged out of the
 * repository, extracted somewhere else, double-clicked. Nothing is served,
 * nothing is built, and the working repository is never the thing under test —
 * that is the whole point, because a deck can look perfect in its own folder
 * and still arrive as unstyled text if an asset path is wrong or a file was
 * never packaged.
 *
 * The archive is written by the caller (see scripts/ below) from a temporary
 * git index, so it holds exactly the tracked working tree — ignored folders
 * like presentation/.review are excluded, as they would be for a reviewer.
 *
 * Usage:  node presentation/tools/archive-test.mjs /path/to/extracted/repo
 */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const EXTRACTED = resolve(process.argv[2] ?? '');
const INDEX = join(EXTRACTED, 'presentation/index.html');

if (!existsSync(INDEX)) {
  console.error(`No presentation at ${INDEX} — pass the extracted archive's root.`);
  process.exit(1);
}

const executablePath = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium/chrome-linux/chrome']
  .find((p) => existsSync(p));
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });

const problems = [];
const requested = [];
page.on('console', (m) => { if (m.type() === 'error') problems.push(`console: ${m.text()}`); });
page.on('pageerror', (e) => problems.push(`pageerror: ${e}`));
page.on('requestfailed', (r) => problems.push(`failed request: ${r.url()}`));
page.on('request', (r) => requested.push(r.url()));

// file://, not http:// — no server anywhere in this test.
await page.goto(`file://${INDEX}`, { waitUntil: 'load' });
await page.waitForTimeout(900);
await page.evaluate(async () => {
  for (const img of document.images) img.loading = 'eager';
  await Promise.all([...document.images].map((i) => (i.complete && i.naturalWidth ? null : i.decode().catch(() => {}))));
  await document.fonts.ready;
});

/* ------------------------------------------------------------ the checks */

const state = await page.evaluate(() => {
  const stage = document.querySelector('.stage');
  const cs = stage && getComputedStyle(stage);
  const body = getComputedStyle(document.body);
  return {
    slides: document.querySelectorAll('.slide').length,
    // If the stylesheet did not load, the stage is not 1600px and the page
    // renders as a column of unstyled text.
    stageW: cs ? Math.round(parseFloat(cs.width)) : 0,
    stageH: cs ? Math.round(parseFloat(cs.height)) : 0,
    scaled: cs ? cs.transform !== 'none' : false,
    bodyFont: body.fontFamily,
    bodyBg: body.backgroundColor,
    fonts: [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family))],
    images: [...document.images].map((i) => ({ src: i.getAttribute('src'), ok: i.naturalWidth > 0 })),
    // brand/marks.js draws the wordmark's arc-"o" and the segmented arc.
    marks: document.documentElement.dataset.marks === 'ready',
    arcO: !!document.querySelector('[data-arc-o] svg path'),
    splitArc: !!document.querySelector('[data-split] svg path'),
  };
});

const broken = state.images.filter((i) => !i.ok);
if (state.slides !== 8) problems.push(`${state.slides} slides, expected 8`);
if (state.stageW !== 1600 || state.stageH !== 900) problems.push(`stage is ${state.stageW}x${state.stageH} — the stylesheet did not apply`);
if (!state.scaled) problems.push('the stage is not being scaled — deck.js did not run');
if (!/Inter Tight/.test(state.bodyFont)) problems.push(`body font is ${state.bodyFont} — the stylesheet did not apply`);
if (!state.fonts.includes('Inter Tight') || !state.fonts.includes('Plus Jakarta Sans')) {
  problems.push(`local fonts did not load: ${state.fonts.join(', ') || 'none'}`);
}
if (broken.length) problems.push(`${broken.length} broken image(s): ${broken.map((b) => b.src).join(', ')}`);
if (!state.marks) problems.push('brand/marks.js did not run');
if (!state.arcO) problems.push('the wordmark arc-"o" did not draw');
if (!state.splitArc) problems.push('the segmented macro arc did not draw');

// Keyboard navigation and slide switching, in the extracted copy.
const visited = [];
for (let i = 1; i <= 8; i++) {
  if (i > 1) await page.keyboard.press(i % 2 ? 'Space' : 'ArrowRight');
  await page.waitForTimeout(420);
  visited.push(await page.evaluate(() => document.querySelector('.pager').textContent.trim().slice(0, 2)));
}
await page.keyboard.press('ArrowLeft');
await page.waitForTimeout(400);
const back = await page.evaluate(() => document.querySelector('.pager').textContent.trim().slice(0, 2));
if (visited.join(',') !== '01,02,03,04,05,06,07,08') problems.push(`keyboard walk gave ${visited.join(',')}`);
if (back !== '07') problems.push(`ArrowLeft from 08 gave ${back}`);

// Full screen: the API has to be present and the handler wired. Headless
// Chromium grants it without a user gesture, so this exercises the real path.
const fs = await page.evaluate(async () => {
  if (!document.documentElement.requestFullscreen) return 'unsupported';
  try {
    await document.documentElement.requestFullscreen();
    const on = !!document.fullscreenElement;
    if (on) await document.exitFullscreen();
    return on ? 'entered and exited' : 'request resolved but no fullscreen element';
  } catch (e) { return `blocked: ${e.name}`; }
});

// Nothing may reach outside the extracted folder.
const outside = requested.filter((u) => !u.startsWith(`file://${EXTRACTED}`) && u !== 'about:blank');
if (outside.length) problems.push(`requests outside the archive: ${[...new Set(outside)].join(', ')}`);

await page.screenshot({ path: join(EXTRACTED, 'archive-test.png') });
await browser.close();

/* --------------------------------------------------------------- report */

console.log(`\nClean-archive test — file://${EXTRACTED}\n`);
console.log(`  slides                 ${state.slides}`);
console.log(`  stage                  ${state.stageW} x ${state.stageH}, scaled: ${state.scaled}`);
console.log(`  stylesheet applied     ${state.stageW === 1600 ? 'yes' : 'NO'} (body font: ${state.bodyFont.split(',')[0]}, bg: ${state.bodyBg})`);
console.log(`  local fonts loaded     ${state.fonts.join(', ') || 'none'}`);
console.log(`  images                 ${state.images.length} referenced, ${broken.length} broken`);
console.log(`  brand renderers        marks.js ${state.marks ? 'ran' : 'DID NOT RUN'}, arc-"o" ${state.arcO ? 'drawn' : 'MISSING'}, segmented arc ${state.splitArc ? 'drawn' : 'MISSING'}`);
console.log(`  keyboard walk          ${visited.join(' ')} , ArrowLeft -> ${back}`);
console.log(`  full screen            ${fs}`);
console.log(`  requests outside       ${outside.length}`);
console.log(`\n=== PROBLEMS (${problems.length}) ===`);
if (!problems.length) console.log('  none');
else [...new Set(problems)].forEach((p) => console.log(`  ${p}`));
console.log();
process.exit(problems.length ? 1 : 0);
