/**
 * Story-only wrapper. Renders a component at the real target width
 * (390px, 24px margins) so overflow and touch targets are judged honestly.
 * Not part of the design system — never imported by a component.
 */
export const Frame = ({ children, padded = true, background = 'surface', width = 390 }) => (
  <div
    className="ds-frame"
    style={{
      width,
      maxWidth: '100%',
      margin: '0 auto',
      background: background === 'canvas' ? 'var(--ds-canvas)' : 'var(--ds-surface)',
      borderRadius: 'var(--ds-radius-lg)',
      padding: padded ? 'var(--ds-screen-margin)' : 0,
      boxShadow: '0 0 0 1px rgba(28,27,25,.05)',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

/** Vertical stack for showing several states of one component in a story. */
export const Stack = ({ children, gap = 24 }) => (
  // minmax(0, 1fr) rather than the default auto: a grid item's min-width is
  // otherwise its min-content size, which stops children shrinking.
  <div style={{ display: 'grid', gap, alignContent: 'start', gridTemplateColumns: 'minmax(0, 1fr)' }}>
    {children}
  </div>
);

/** Small ink-2 caption above a specimen in a multi-state story. */
export const Note = ({ children }) => (
  <p style={{ font: '500 14px/1.4 var(--ds-font-ui)', color: 'var(--ds-ink-2)', margin: '0 0 10px' }}>
    {children}
  </p>
);
