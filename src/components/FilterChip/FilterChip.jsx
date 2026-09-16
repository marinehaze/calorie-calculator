import './FilterChip.css';
import { IconClose, IconCheck } from '../../lib/icons';

/**
 * FilterChip — two jobs, one component.
 *
 *  mode="toggle"  inside the filter sheet: a value you switch on and off.
 *                 Selected takes the berry tint, a full berry border, berry
 *                 text at medium weight and a check glyph. State is announced
 *                 with aria-pressed.
 *  mode="remove"  under the search field: the filters currently in force,
 *                 where the whole chip is the remove target ("remove one in a
 *                 tap"). Every chip there is active by definition, so it has
 *                 no selected state — `selected` is ignored in this mode. It
 *                 sits one step below the selected toggle: same tint, a 70%
 *                 berry border, regular weight.
 *
 * Selection never rests on hue alone — border strength, weight and a glyph all
 * change with it, so it survives greyscale and colour blindness.
 */
export const FilterChip = ({
  children,
  mode = 'toggle',
  selected = false,
  disabled = false,
  onClick,
  ...rest
}) => {
  const isRemove = mode === 'remove';
  return (
    <button
      type="button"
      className={`ds-filter-chip ds-filter-chip--${isRemove ? 'remove' : 'toggle'}`}
      aria-pressed={isRemove ? undefined : selected}
      aria-label={isRemove ? `Remove filter: ${children}` : undefined}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {!isRemove && selected && (
        <span className="ds-filter-chip__check"><IconCheck size={16} /></span>
      )}
      {children}
      {isRemove && <span className="ds-filter-chip__remove"><IconClose size={16} /></span>}
    </button>
  );
};

export const FilterChipRow = ({ children, label = 'Active filters' }) => (
  <div className="ds-filter-chip-row" role="group" aria-label={label}>{children}</div>
);

export const FilterChipGroup = ({ children, label }) => (
  <div className="ds-filter-chip-group" role="group" aria-label={label}>{children}</div>
);
