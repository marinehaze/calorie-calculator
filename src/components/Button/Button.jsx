import './Button.css';

/**
 * Button — the product's actions.
 *
 * One berry button per surface. `secondary` is the hairline alternative and
 * `quiet` is berry on its own tint, for a supporting action that repeats.
 * Height is 56px (44px when small), so every button clears the 44px target.
 *
 * `loading` sets `disabled` so the action cannot be fired twice, and
 * `aria-busy` so the state is announced. The primary variant keeps its berry
 * fill while busy — see Button.css — so loading never reads as disabled.
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  loading = false,
  disabled = false,
  loadingLabel = 'Working…',
  iconBefore,
  className = '',
  ...rest
}) => (
  <button
    type="button"
    className={[
      'ds-button',
      `ds-button--${variant}`,
      size === 'small' && 'ds-button--small',
      fullWidth && 'ds-button--full',
      className,
    ].filter(Boolean).join(' ')}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    {...rest}
  >
    {loading && <span className="ds-button__spinner" aria-hidden="true" />}
    {loading && <span className="ds-sr-only">{loadingLabel}</span>}
    <span className="ds-button__label" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--ds-space-1)' }}>
      {iconBefore}
      {children}
    </span>
  </button>
);
