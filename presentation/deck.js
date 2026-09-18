/**
 * Deck runtime — small on purpose.
 *
 * Three jobs and nothing else:
 *   1. scale the fixed 1600x900 stage to fit the window (no reflow, no scroll)
 *   2. move between slides from the keyboard, a click, or the location hash
 *   3. keep the slide number and the fullscreen toggle honest
 *
 * No framework, no build step: open index.html and present.
 */
(() => {
  const STAGE_W = 1600;
  const STAGE_H = 900;

  const stage = document.querySelector('.stage');
  const slides = [...document.querySelectorAll('.slide')];
  const pager = document.querySelector('.pager');
  const hint = document.querySelector('.hint');
  const total = slides.length;

  /* ------------------------------------------------------------- scale */

  const fit = () => {
    // 1:1 at 1600x900 or larger, scaled down proportionally below that. The
    // stage keeps its 16:9 shape at every window size, so the composition a
    // slide was designed at is the composition that records.
    const k = Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
    stage.style.setProperty('--k', k);
  };

  window.addEventListener('resize', fit);
  fit();

  /* ------------------------------------------------------------ slides */

  let index = 0;

  const show = (next, { push = true } = {}) => {
    const i = Math.max(0, Math.min(total - 1, next));
    if (i === index && slides[i].hasAttribute('data-active')) return;
    index = i;

    slides.forEach((s, n) => {
      if (n === i) s.setAttribute('data-active', '');
      else s.removeAttribute('data-active');
      // Keep the inactive slides out of the accessibility tree and out of the
      // tab order, so the links on slide 8 are only reachable on slide 8.
      s.setAttribute('aria-hidden', n === i ? 'false' : 'true');
      s.querySelectorAll('a').forEach((a) => (n === i ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1')));
    });

    pager.innerHTML = `<b>${String(i + 1).padStart(2, '0')}</b> / ${String(total).padStart(2, '0')}`;
    if (push) history.replaceState(null, '', `#${i + 1}`);
    if (i > 0) hint.hidden = true;
  };

  const go = (delta) => show(index + delta);

  /* ---------------------------------------------------------- keyboard */

  const NEXT = new Set(['ArrowRight', ' ', 'Spacebar', 'PageDown', 'ArrowDown', 'Enter']);
  const PREV = new Set(['ArrowLeft', 'PageUp', 'ArrowUp', 'Backspace']);

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (NEXT.has(e.key)) { e.preventDefault(); go(1); }
    else if (PREV.has(e.key)) { e.preventDefault(); go(-1); }
    else if (e.key === 'Home') { e.preventDefault(); show(0); }
    else if (e.key === 'End') { e.preventDefault(); show(total - 1); }
    else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFullscreen(); }
    else if (/^[1-9]$/.test(e.key)) { e.preventDefault(); show(Number(e.key) - 1); }
  });

  /* ------------------------------------------------- pointer + fullscreen */

  // A click advances, except on a link — the two URLs on the last slide have
  // to stay clickable.
  stage.addEventListener('click', (e) => { if (!e.target.closest('a')) go(1); });

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().then(fit, () => {});
  };
  document.addEventListener('fullscreenchange', fit);

  /* ---------------------------------------------------------------- hash */

  const fromHash = () => {
    const n = Number((location.hash || '').replace('#', ''));
    return Number.isInteger(n) && n >= 1 && n <= total ? n - 1 : 0;
  };
  window.addEventListener('hashchange', () => show(fromHash(), { push: false }));

  show(fromHash(), { push: false });
  if (index > 0) hint.hidden = true;
})();
