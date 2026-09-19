/* ---------------------------------------------------------------------------
   The Piatto arc-"o" — the final letter of the wordmark drawn as the partial
   arc. Selected direction: variant B, refined to a 35° opening.

   The letter is measured from the typeface's own "o" at render time (advance
   width, ink box, stem thickness) and redrawn as a single uniform stroke with
   round terminals, so the word keeps Plus Jakarta Sans' proportions exactly.

   Usage:  piatt<span data-arc-o aria-hidden="true">o</span>
           optional: data-arc-o="40" to override the opening (degrees, visible
           between the round terminals). The opening sits at one o'clock.

   The parent should carry aria-label="Piatto": the name is always written
   normally in text and for assistive technology; this is a visual treatment.
   --------------------------------------------------------------------------- */
(function () {
  const DEFAULT_OPENING = 35;
  const CENTRE = -50; // one o'clock, as the brand mark

  function measureO(font) {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    ctx.font = font;
    const m = ctx.measureText('o');
    const adv = m.width, asc = m.actualBoundingBoxAscent, desc = m.actualBoundingBoxDescent;
    const left = m.actualBoundingBoxLeft, right = m.actualBoundingBoxRight;
    const inkW = left + right, inkH = asc + desc;
    const S = 8;
    c.width = Math.ceil(inkW * S) + 32; c.height = Math.ceil(inkH * S) + 32;
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
  }

  const P = (cx, cy, rx, ry, a) => [cx + rx * Math.cos(a * Math.PI / 180), cy + ry * Math.sin(a * Math.PI / 180)];
  const f = (n) => n.toFixed(2);

  function draw(el) {
    const opening = Number(el.dataset.arcO) || DEFAULT_OPENING;
    const cs = getComputedStyle(el);
    const m = measureO(`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`);
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${m.adv} ${m.inkH}`);
    svg.setAttribute('width', m.adv); svg.setAttribute('height', m.inkH);
    svg.setAttribute('aria-hidden', 'true');
    svg.style.display = 'block'; svg.style.overflow = 'visible';
    const cx = (-m.left + m.right) / 2, cy = m.inkH / 2;
    const s = m.stem;
    const rx = m.inkW / 2 - s / 2, ry = m.inkH / 2 - s / 2;
    const cap = Math.asin((s / 2) / rx) * 180 / Math.PI;
    const a0 = CENTRE + opening / 2 + cap, a1 = CENTRE - opening / 2 - cap + 360;
    const [x0, y0] = P(cx, cy, rx, ry, a0), [x1, y1] = P(cx, cy, rx, ry, a1);
    const path = document.createElementNS(ns, 'path');
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
  }

  document.fonts.ready.then(() => {
    document.querySelectorAll('[data-arc-o]').forEach(draw);
    document.body.dataset.arcO = '1';
  });
})();
