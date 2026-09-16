import './PortionPair.css';

/**
 * PortionPair — portion on the left, per-100g on the right.
 *
 * These are the second level of the nutrition hierarchy and they are a pair,
 * not two facts: per-100g is what makes the portion figure comparable. A null
 * value prints "Not available" rather than a zero, which would read as a fact.
 */
export const PortionPair = ({
  portion,
  per100,
  portionLabel = 'Portion',
  per100Label = 'Per 100 g',
  unavailableLabel = 'Not available',
}) => {
  const cell = (value, label) => (
    <div className="ds-portion-pair__cell">
      {value == null ? (
        <span className="ds-portion-pair__value ds-portion-pair__value--unavailable">{unavailableLabel}</span>
      ) : (
        <span className="ds-portion-pair__value ds-num">{value}</span>
      )}
      <span className="ds-portion-pair__label">{label}</span>
    </div>
  );
  return (
    <div className="ds-portion-pair">
      {cell(portion, portionLabel)}
      {cell(per100, per100Label)}
    </div>
  );
};
