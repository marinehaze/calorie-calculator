import './IngredientRow.css';

/**
 * IngredientRow — a line item, on Recipe Detail and inside a multi-item dish
 * on Nutrition Result.
 *
 * `flag` carries the "ingredient conflicts with an active filter" case from
 * SCREENS.md. It is a sentence, not a colour: the berry rule and the berry
 * text appear together, and the sentence is what is announced.
 *
 * `onClick` makes the row the item-swap affordance. The row is always an <li>
 * — a list may only contain list items — and the button lives inside it.
 */
export const IngredientRow = ({
  name,
  amount,
  kcal,
  unit = '',
  flag,
  onClick,
  unavailableLabel = 'n/a',
  ...rest
}) => {
  const content = (
    <>
      <span className="ds-ingredient-row__name">
        {name}
        {flag && <span className="ds-ingredient-row__flag">{flag}</span>}
      </span>
      <span className="ds-ingredient-row__amount">{amount}</span>
      {kcal == null ? (
        <span className="ds-ingredient-row__kcal ds-ingredient-row__kcal--unavailable">
          {unavailableLabel}
          <span className="ds-sr-only"> calories not available</span>
        </span>
      ) : (
        <span className="ds-ingredient-row__kcal">{kcal}{unit}</span>
      )}
    </>
  );

  const className = ['ds-ingredient-row', onClick && 'ds-ingredient-row--interactive', flag && 'ds-ingredient-row--flagged']
    .filter(Boolean).join(' ');

  return (
    <li className="ds-ingredient-item">
      {onClick
        ? <button type="button" className={className} onClick={onClick} {...rest}>{content}</button>
        : <div className={className} {...rest}>{content}</div>}
    </li>
  );
};

/**
 * The list wrapper supplies the closing hairline. `open` drops it, for when the
 * list is cut off by a scroll fade rather than ending.
 */
export const IngredientList = ({ children, open = false, label = 'Ingredients' }) => (
  <ul className={['ds-ingredient-list', open && 'ds-ingredient-list--open'].filter(Boolean).join(' ')} aria-label={label}>
    {children}
  </ul>
);
