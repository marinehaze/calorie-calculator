import './SegmentedControl.css';

/**
 * SegmentedControl — a mutually exclusive switch between two readings of the
 * same number (Portion / Per 100 g). It is a radiogroup, not a tab list: it
 * changes the basis of the value on screen, not the screen.
 *
 * Arrow keys move between options, which is what a radiogroup owes a keyboard.
 */
export const SegmentedControl = ({ options, value, onChange, label, disabled = false }) => {
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
    <div className="ds-segmented" role="radiogroup" aria-label={label} onKeyDown={onKeyDown}>
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
            {o.label}
          </button>
        );
      })}
    </div>
  );
};
