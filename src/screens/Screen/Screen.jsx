import './Screen.css';

/**
 * Screen — the 390px device shell the four screens are assembled inside.
 *
 * This is screen-level composition, not a design system component: it adds no
 * visual language of its own beyond the app's own canvas, and it is not
 * exported from `src/index.js`. It exists so every screen scrolls, pins and
 * layers the same way.
 *
 * Three slots, and the order matters:
 *
 *   header   fixed at the top, outside the scroll — Food Search's search
 *            field stays reachable while results scroll under it.
 *   children the scrolling body, carrying the 24px screen margin so a
 *            `.ds-bleed-stage` inside it can bleed back out to the edge.
 *   footer   pinned at the bottom — the TabBar on a root screen. Nutrition
 *            Result passes none: SCREENS.md gives a drill-down a back control
 *            instead of a tab bar.
 *   overlay  sheets and the camera view. A sibling of the scroll area rather
 *            than a child of it, so `BottomSheet contained` positions against
 *            the screen and does not scroll away with the body.
 */
export const Screen = ({ header, children, footer, overlay, height = 844, label }) => (
  <section className="screen" style={{ height }} aria-label={label}>
    {header && <div className="screen__header">{header}</div>}
    <div className="screen__scroll">{children}</div>
    {footer && <div className="screen__footer">{footer}</div>}
    {overlay}
  </section>
);
