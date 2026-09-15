import './MacroGroup.css';

const MACROS = [
  { key: 'protein', label: 'Protein', color: 'var(--ds-macro-protein)' },
  { key: 'carbs',   label: 'Carbs',   color: 'var(--ds-macro-carbs)' },
  { key: 'fat',     label: 'Fat',     color: 'var(--ds-macro-fat)' },
];

/**
 * MacroGroup — the third level of the hierarchy.
 *
 * All three sit on one grid at equal weight, because nothing here is being
 * judged. DECISIONS.md removed red/amber/green semantics from nutrition
 * values: nothing turns red at someone for eating.
 *
 * The dots are decorative reinforcement of a text label that is always
 * present, so the carbs marker (#C08442, 3.17 : 1) never has to carry meaning
 * it cannot carry at that contrast.
 *
 * A macro the database does not have prints "Not available", not "0 g".
 */
export const MacroGroup = ({ macros, unit = 'g', pending = false, unavailableLabel = 'Not available' }) => (
  <dl className={['ds-macro-group', pending && 'ds-macro-group--pending'].filter(Boolean).join(' ')}>
    {MACROS.map(({ key, label, color }) => {
      const value = macros?.[key];
      return (
        <div className="ds-macro" key={key}>
          <dt className="ds-macro__label">
            <span className="ds-macro__dot" style={{ background: color }} aria-hidden="true" />
            {label}
          </dt>
          <dd className="ds-macro__value-wrap">
            {value == null ? (
              <span className="ds-macro__value ds-macro__value--unavailable">{unavailableLabel}</span>
            ) : (
              <span className="ds-macro__value ds-num">{value} {unit}</span>
            )}
          </dd>
        </div>
      );
    })}
  </dl>
);
