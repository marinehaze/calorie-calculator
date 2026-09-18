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
 *   footer   the pinned bottom band. The TabBar on a root screen; the single
 *            loop-back action on Nutrition Result, which has no tab bar
 *            because SCREENS.md gives a drill-down a back control instead.
 *            The shell paints the band's surface; its content carries the
 *            device safe-area inset.
 *   overlay  sheets and the camera view. A sibling of the scroll area rather
 *            than a child of it, so `BottomSheet contained` positions against
 *            the screen and does not scroll away with the body.
 */
export const Screen = ({ header, children, footer, overlay, height = 844, label }) => (
  <section className="screen" style={{ height }} aria-label={label}>
    {header && <div className="screen__header">{header}</div>}
    {/* Without a footer the body is the last thing on the screen, so it has to
        carry the bottom inset itself — otherwise the final line of content
        sits under the home indicator. With a footer the band's content already
        carries it, and adding it here would count it twice. */}
    <div className={['screen__scroll', !footer && 'screen__scroll--no-band'].filter(Boolean).join(' ')}>
      {children}
    </div>
    {footer && <div className="screen__footer">{footer}</div>}
    {overlay}
  </section>
);
