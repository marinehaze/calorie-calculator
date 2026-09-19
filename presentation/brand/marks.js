/* ---------------------------------------------------------------------------
   Piatto brand marks, for the presentation only.

   Both renderers are copied from the approved brand-refresh work so the deck
   draws the real marks rather than an approximation, and so nothing in
   `branding/` has to be loaded across directories at present time:

     arcO()      — branding/brand-refresh/arc-o.js
                   the final "o" of the wordmark, drawn as the partial arc:
                   measured from Plus Jakarta Sans' own "o" (advance width, ink
                   box, stem thickness) at render time, one uniform stroke,
                   round terminals, 35° opening at one o'clock.

     segments()  — src/components/MacroEnergySplit/MacroEnergySplit.jsx
                   the segmented arc: one circle, three segments, 16° gaps,
                   12.5 stroke on a 100 viewBox, starting at 12 o'clock.

   Single arc = brand (portion, proportion, mark, icon).
   Segmented arc = data (protein, carbs, fat) and nothing else.

   The single arc itself is an inline <symbol> in index.html, straight from the
   brand board, so it needs no code here.
   --------------------------------------------------------------------------- */
(() => {
  /* ------------------------------------------------------------- the arc-"o" */

  const OPENING = 35;   // degrees visible between the round terminals
  const CENTRE = -50;   // one o'clock, as the brand mark

  const measureO = (font) => {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    ctx.font = font;
    const m = ctx.measureText('o');
    const adv = m.width, asc = m.actualBoundingBoxAscent, desc = m.actualBoundingBoxDescent;
    const left = m.actualBoundingBoxLeft, right = m.actualBoundingBoxRight;
    const inkW = left + right, inkH = asc + desc;
    const S = 8;
    c.width = Math.ceil(inkW * S) + 32;
    c.height = Math.ceil(inkH * S) + 32;
    ctx.scale(S, S); ctx.font = font; ctx.fillStyle = '#000';
    ctx.fillText('o', left + 2, asc + 2);
    const img = ctx.getImageData(0, 0, c.width, c.height).data;
    const yMid = Math.round((2 + inkH / 2) * S);
    let x0 = -1, stem = 0;
    for (let x = 0; x < c.width; x++) {
      const on = img[(yMid * c.width + x) * 4 + 3] > 120;
      if (on && x0 < 0) x0 = x;
      if (x0 >= 0 && !on) { stem = (x - x0) / S; break; }
    }
    return { adv, desc, left, right, inkW, inkH, stem: stem || inkH * 0.16 };
  };

  const P = (cx, cy, rx, ry, a) => [cx + rx * Math.cos(a * Math.PI / 180), cy + ry * Math.sin(a * Math.PI / 180)];
  const f = (n) => n.toFixed(2);
  const NS = 'http://www.w3.org/2000/svg';

  const arcO = (el) => {
    const cs = getComputedStyle(el);
    const m = measureO(`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`);
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${m.adv} ${m.inkH}`);
    svg.setAttribute('width', m.adv);
    svg.setAttribute('height', m.inkH);
    svg.setAttribute('aria-hidden', 'true');
    svg.style.display = 'block';
    svg.style.overflow = 'visible';
    const cx = (-m.left + m.right) / 2, cy = m.inkH / 2, s = m.stem;
    const rx = m.inkW / 2 - s / 2, ry = m.inkH / 2 - s / 2;
    const cap = Math.asin((s / 2) / rx) * 180 / Math.PI;
    const a0 = CENTRE + OPENING / 2 + cap, a1 = CENTRE - OPENING / 2 - cap + 360;
    const [x0, y0] = P(cx, cy, rx, ry, a0), [x1, y1] = P(cx, cy, rx, ry, a1);
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', `M${f(x0)} ${f(y0)}A${f(rx)} ${f(ry)} 0 1 1 ${f(x1)} ${f(y1)}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', s);
    path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);
    el.textContent = '';
    el.appendChild(svg);
    el.style.display = 'inline-block';
    el.style.verticalAlign = (-m.desc) + 'px';
    el.style.width = m.adv + 'px';
    el.style.marginLeft = '.02em';
  };

  /* ------------------------------------------------------- the segmented arc */

  const GAP = 16, R = 43.75, STROKE = 12.5;
  const CAP = Math.asin((STROKE / 2) / R) * 180 / Math.PI;
  const point = (deg) => [50 + R * Math.cos(deg * Math.PI / 180), 50 + R * Math.sin(deg * Math.PI / 180)];

  const segments = (kcal, total) => {
    const usable = 360 - GAP * kcal.length;
    let start = -90 + GAP / 2;
    return kcal.map((v) => {
      const sweep = usable * v / total;
      const s = start + CAP, e = Math.max(start + sweep - CAP, s + 0.5);
      const [x0, y0] = point(s), [x1, y1] = point(e);
      start += sweep + GAP;
      return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 ${sweep - 2 * CAP > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
    });
  };

  /** data-split="21,44,3.5" — grams of protein, carbs, fat. */
  const energyArc = (el) => {
    const grams = el.dataset.split.split(',').map(Number);
    const kcal = [grams[0] * 4, grams[1] * 4, grams[2] * 9];
    const total = kcal.reduce((a, b) => a + b, 0);
    const colors = ['var(--protein)', 'var(--carbs)', 'var(--fat)'];
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');
    segments(kcal, total).forEach((d, i) => {
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', colors[i]);
      path.setAttribute('stroke-width', STROKE);
      path.setAttribute('stroke-linecap', 'round');
      svg.appendChild(path);
    });
    el.appendChild(svg);
  };

  document.fonts.ready.then(() => {
    document.querySelectorAll('[data-arc-o]').forEach(arcO);
    document.querySelectorAll('[data-split]').forEach(energyArc);
    document.documentElement.dataset.marks = 'ready';
  });
})();
