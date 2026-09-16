/**
 * Design system audit — runs the built Storybook through a headless browser at
 * the real target width and checks the three things this system commits to:
 *
 *   1. nothing overflows horizontally at 390px
 *   2. every interactive control is at least 44 x 44
 *   3. no WCAG 2.1 A/AA violations (axe-core), contrast included
 *
 * Usage:  npm run build-storybook && npm run audit
 */
import { chromium } from 'playwright';
import { readFileSync, statSync, createReadStream, existsSync } from 'node:fs';
import http from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve('storybook-static');
const PORT = 4399;
const WIDTH = 390;

if (!existsSync(join(ROOT, 'index.json'))) {
  console.error('No build found. Run `npm run build-storybook` first.');
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

const axeSource = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const stories = Object.values(JSON.parse(readFileSync(join(ROOT, 'index.json'), 'utf8')).entries)
  .filter((e) => e.type === 'story');

// The sandbox ships Chromium at a fixed path; fall back to Playwright's own.
const executablePath = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium/chrome-linux/chrome']
  .find((p) => existsSync(p));

const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: WIDTH, height: 844 }, deviceScaleFactor: 2 });

const overflow = [], smallTargets = [], errors = [], violations = new Map();
page.on('pageerror', (e) => errors.push(String(e)));

for (const s of stories) {
  await page.goto(`http://127.0.0.1:${PORT}/iframe.html?id=${s.id}&viewMode=story`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const result = await page.evaluate((viewport) => {
    // Storybook keeps its error and "no preview" panels in the DOM at all
    // times and switches between them with a class on <body>. That class is
    // the only reliable signal that a story did not render.
    if (!document.body.classList.contains('sb-show-main')) return { failed: true, wide: [], small: [] };
    const out = { failed: false, scrollW: document.documentElement.scrollWidth, wide: [], small: [] };

    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el);
      // Bleed crops are positioned deliberately outside the content column.
      if (cs.position === 'absolute' || cs.position === 'fixed') continue;
      // Content inside a horizontal scroller is meant to extend past it.
      let scroller = false;
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        const ov = getComputedStyle(a).overflowX;
        if (ov === 'auto' || ov === 'scroll') { scroller = true; break; }
      }
      if (scroller) continue;
      if (r.right > viewport + 1 || r.left < -1) {
        out.wide.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} → ${Math.round(r.left)}..${Math.round(r.right)}`);
      }
    }

    const SEL = 'button, a[href], input, select, textarea, [role="radio"], [tabindex]:not([tabindex="-1"])';
    for (const el of document.querySelectorAll(SEL)) {
      if (el.classList.contains('ds-sheet__scrim')) continue; // full-bleed, not tabbable
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (r.width < 43.5 || r.height < 43.5) {
        out.small.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} → ${Math.round(r.width)}x${Math.round(r.height)} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 32)}"`);
      }
    }
    return out;
  }, WIDTH);

  if (result.failed) { errors.push(`${s.id} failed to render`); continue; }
  if (result.scrollW > WIDTH + 1 || result.wide.length) {
    overflow.push({ id: s.id, scrollW: result.scrollW, wide: [...new Set(result.wide)].slice(0, 6) });
  }
  if (result.small.length) smallTargets.push({ id: s.id, small: [...new Set(result.small)].slice(0, 8) });

  await page.addScriptTag({ content: axeSource });
  const found = await page.evaluate(async () => {
    const r = await window.axe.run(document.body, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } });
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, node: v.nodes[0]?.html.slice(0, 140) ?? '' }));
  });
  for (const v of found) {
    if (!violations.has(v.id)) violations.set(v.id, { ...v, stories: [] });
    violations.get(v.id).stories.push(s.id);
  }
}

const section = (title, rows, render) => {
  console.log(`\n=== ${title} (${rows.length}) ===`);
  if (!rows.length) console.log('  none');
  else rows.forEach(render);
};

console.log(`\nAudited ${stories.length} stories at ${WIDTH}px.`);
section('HORIZONTAL OVERFLOW', overflow, (o) => console.log(`  ${o.id} (scrollWidth ${o.scrollW})\n    ${o.wide.join('\n    ')}`));
section('TOUCH TARGETS UNDER 44px', smallTargets, (o) => console.log(`  ${o.id}\n    ${o.small.join('\n    ')}`));
section('WCAG 2.1 A/AA VIOLATIONS', [...violations.values()], (v) =>
  console.log(`  [${v.impact}] ${v.id} — ${v.help}\n    ${v.stories.length} stories, e.g. ${v.stories[0]}\n    ${v.node}`));
section('PAGE ERRORS', [...new Set(errors)], (e) => console.log(`  ${e}`));

await browser.close();
server.close();

const failed = overflow.length + smallTargets.length + violations.size + errors.length;
console.log(failed === 0 ? '\nPASS\n' : `\nFAIL — ${failed} problem group(s)\n`);
process.exit(failed === 0 ? 0 : 1);
