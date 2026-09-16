import './SegmentedControl.css';

/**
 * SegmentedControl — a mutually exclusive switch between two readings of the
 * same value. It is a radiogroup, not a tab list: it changes the basis of what
 * is on screen, not the screen.
 *
 *   variant="default"  the pill. Use where the switch is the interaction —
 *                      Portion / Per 100 g on Nutrition Result.
 *   variant="text"     plain text options, no track. Use where the switch is
 *                      only a mode and something below it is the real
 *                      interaction — Grams / Portions in the portion sheet.
 *
 * Both variants are the same component with the same radiogroup semantics and
 * the same 44px targets; only the clothes differ.
 *
 * Arrow keys move between options, which is what a radiogroup owes a keyboard.
 */
export const SegmentedControl = ({ options, value, onChange, label, variant = 'default', disabled = false }) => {
  const onKeyDown = (e) => {
    const i = options.findIndex((o) => o.value === value);
    if (i < 0) return;
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (i + 1) % options.length
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (i - 1 + options.length) % options.length
      : null;
    if (next === null) return;
    e.preventDefault();
    onChange?.(options[next].value);
  };

  return (
    <div
      className={['ds-segmented', variant === 'text' && 'ds-segmented--text'].filter(Boolean).join(' ')}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      {options.map((o) => {
        const checked = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            disabled={disabled}
            className="ds-segmented__option"
            onClick={() => onChange?.(o.value)}
          >
            <span className="ds-segmented__label">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
};
