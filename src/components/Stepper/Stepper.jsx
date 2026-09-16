import './Stepper.css';
import { IconMinus, IconPlus } from '../../lib/icons';

/**
 * Stepper — servings, and the amount inside the portion sheet.
 *
 *   variant="default"  label on the left, control on the right, soft track.
 *   variant="bare"     no label, no track: [−] value [+] bound by alignment
 *                      and open space. Same 44px targets, less visual weight.
 *
 * `unit` renders beside the value rather than inside it, so the bare variant
 * can set the figure and its unit at different sizes. Without `unit`, the
 * value goes through `formatValue`.
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
  variant = 'default',
  formatValue = (v) => `${v}${unit ? ` ${unit}` : ''}`,
}) => {
  const name = label ?? 'amount';
  return (
    <div className={['ds-stepper', variant === 'bare' && 'ds-stepper--bare'].filter(Boolean).join(' ')}>
      {label && variant !== 'bare' && <span className="ds-stepper__label">{label}</span>}
      <div className="ds-stepper__control">
        <button
          type="button"
          className="ds-stepper__button"
          aria-label={`Decrease ${name}`}
          disabled={value <= min}
          onClick={() => onChange?.(Math.max(min, value - step))}
        >
          <IconMinus size={20} />
        </button>
        <span className="ds-stepper__value ds-num" role="status" aria-live="polite">
          {unit ? (
            <>
              <span className="ds-stepper__num">{value}</span>{' '}
              <span className="ds-stepper__unit">{unit}</span>
            </>
          ) : formatValue(value)}
        </span>
        <button
          type="button"
          className="ds-stepper__button"
          aria-label={`Increase ${name}`}
          disabled={value >= max}
          onClick={() => onChange?.(Math.min(max, value + step))}
        >
          <IconPlus size={20} />
        </button>
      </div>
    </div>
  );
};
