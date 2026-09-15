import './Stepper.css';
import { IconMinus, IconPlus } from '../../lib/icons';

/**
 * Stepper — servings, and the amount inside the portion sheet.
 *
 * The value is a live region: SCREENS.md says amounts and nutrition recompute
 * in place rather than behind a blocking spinner, so the new figure has to be
 * announced when it changes.
 */
export const Stepper = ({
  label,
  value,
  unit,
  min = 1,
  max = 99,
  step = 1,
  onChange,
  formatValue = (v) => `${v}${unit ? ` ${unit}` : ''}`,
}) => (
  <div className="ds-stepper">
    {label && <span className="ds-stepper__label" id="ds-stepper-label">{label}</span>}
    <div className="ds-stepper__control">
      <button
        type="button"
        className="ds-stepper__button"
        aria-label={`Decrease ${label ?? 'value'}`}
        disabled={value <= min}
        onClick={() => onChange?.(Math.max(min, value - step))}
      >
        <IconMinus size={20} />
      </button>
      <span className="ds-stepper__value ds-num" role="status" aria-live="polite">
        {formatValue(value)}
      </span>
      <button
        type="button"
        className="ds-stepper__button"
        aria-label={`Increase ${label ?? 'value'}`}
        disabled={value >= max}
        onClick={() => onChange?.(Math.min(max, value + step))}
      >
        <IconPlus size={20} />
      </button>
    </div>
  </div>
);
