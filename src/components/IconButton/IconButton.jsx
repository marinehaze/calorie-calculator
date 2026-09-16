import './IconButton.css';

/**
 * IconButton — an action carried by a glyph alone.
 *
 * `label` is required and is not optional politeness: it is the only name the
 * control has. The hit area is always 44 x 44 even though the glyph is 24px.
 *
 * Two variants only — `plain` and `soft`. Between them they cover every icon
 * action the four screens need: barcode, clear, back, close and the filter
 * trigger. There is no filled berry variant; none of those actions is a
 * primary action.
 */
export const IconButton = ({
  icon,
  label,
  variant = 'plain',
  className = '',
  ...rest
}) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className={['ds-icon-button', `ds-icon-button--${variant}`, className].filter(Boolean).join(' ')}
    {...rest}
  >
    {icon}
  </button>
);
