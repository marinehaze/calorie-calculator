import './IconButton.css';

/**
 * IconButton — an action carried by a glyph alone.
 *
 * `label` is required and is not optional politeness: it is the only name the
 * control has. The hit area is always 44 x 44 even though the glyph is 24px.
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
