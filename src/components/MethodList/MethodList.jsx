import './MethodList.css';

/**
 * MethodList / MethodStep — the method on Recipe Detail.
 *
 * SCREENS.md gives Screen 4 one dedicated state, "ingredients, steps and
 * nutrition in one readable scroll". Ingredients are `IngredientRow`; this is
 * the steps.
 *
 * It is deliberately the smallest thing that does the job: an ordered list, a
 * number and a sentence. Steps are prose, not a numeric row, so they do not go
 * through `IngredientRow` — forcing them into its fixed name / amount / kcal
 * columns would damage a component that is right as it is.
 *
 * The number comes from a CSS counter on the <ol>, so the markup carries the
 * order and the browser announces "list, 6 items" without the numbers being
 * typed into the content. Steps are separated by space, never by a card.
 */
export const MethodList = ({ children, label = 'Method', ...rest }) => (
  <ol className="ds-method-list" aria-label={label} {...rest}>{children}</ol>
);

export const MethodStep = ({ children, ...rest }) => (
  <li className="ds-method-step" {...rest}>
    <span className="ds-method-step__body">{children}</span>
  </li>
);
