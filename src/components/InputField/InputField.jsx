import './InputField.css';

/**
 * InputField — the manual-entry field.
 *
 * SCREENS.md gives Food Search's no-results state three recovery paths, and
 * the third is "enter values manually". That is authoring new data, not
 * finding data that already exists, so it is not a `SearchField` variant:
 * `SearchField` carries search semantics, a search glyph and the barcode
 * lookup, and several of these appear together in one sheet.
 *
 * It borrows `SearchField`'s visual language exactly — same height, radius,
 * soft fill, spacing and whole-field focus ring — so the two read as one
 * family. What it adds is a visible label above the field, free text or
 * numeric entry, and an optional trailing unit.
 *
 * The unit is spoken as part of the field's name and hidden from the
 * accessible tree where it is drawn, so "Protein" and "g" are announced once,
 * as "Protein in grams", rather than twice.
 *
 * `optional` prints the word "Optional" beside the label. Optionality is
 * stated in words, not as an asterisk or a colour, for the same reason a
 * missing value is stated in words.
 */
export const InputField = ({
  id,
  label,
  value = '',
  onChange,
  type = 'text',
  inputMode,
  placeholder,
  unit,
  unitLabel,
  optional = false,
  hint,
  disabled = false,
  ...rest
}) => {
  const hintId = hint ? `${id}-hint` : undefined;
  const optionalId = optional ? `${id}-optional` : undefined;
  const describedBy = [optionalId, hintId].filter(Boolean).join(' ') || undefined;
  return (
    <div className="ds-input-field">
      {/* "Optional" is a sibling of the label, not part of it: inside, the
          accessible name computes as "Protein in gramsOptional". It is a
          description instead, and reaches the field through aria-describedby. */}
      <div className="ds-input-field__label-row">
        <label className="ds-input-field__label" htmlFor={id}>
          {label}
          {unit && <span className="ds-sr-only"> in {unitLabel || unit}</span>}
        </label>
        {optional && <span className="ds-input-field__optional" id={optionalId}>Optional</span>}
      </div>

      <div className="ds-input-field__control">
        <input
          id={id}
          className="ds-input-field__input"
          type={type}
          inputMode={inputMode}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          aria-describedby={describedBy}
          onChange={(e) => onChange?.(e.target.value)}
          autoComplete="off"
          {...rest}
        />
        {unit && <span className="ds-input-field__unit" aria-hidden="true">{unit}</span>}
      </div>

      {hint && <p className="ds-input-field__hint" id={hintId}>{hint}</p>}
    </div>
  );
};
