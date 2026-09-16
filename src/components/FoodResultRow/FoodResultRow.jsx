import './FoodResultRow.css';
import { FoodImage } from '../FoodImage/FoodImage';

/**
 * FoodResultRow — a search match, and the same pattern reused inside the
 * item-swap sheet (SCREENS.md: the swap sheet reuses Screen 1's result list).
 *
 * The whole row is the target, so there is one 44px+ hit area rather than a
 * small link inside a large row. The photograph is decorative here: the name
 * beside it already says what the food is.
 *
 * There is deliberately no selected / current-match state: SCREENS.md asks
 * only that the swap sheet reuse this list, and marking the entry the user is
 * replacing would offer them the match they already rejected.
 */
export const FoodResultRow = ({
  name,
  source,
  kcal,
  unit = 'kcal',
  image,
  focal,
  onClick,
  unavailableLabel = 'No data',
  ...rest
}) => (
  <li>
    <button
      type="button"
      className="ds-food-result-row"
      onClick={onClick}
      {...rest}
    >
      {image && (
        <span className="ds-food-result-row__media">
          <FoodImage src={image} crop="thumb" focalX={focal?.x} focalY={focal?.y} scale={focal?.scale} />
        </span>
      )}
      <span className="ds-food-result-row__text">
        <span className="ds-food-result-row__name">{name}</span>
        {source && <span className="ds-food-result-row__source">{source}</span>}
      </span>
      {kcal == null ? (
        <span className="ds-food-result-row__value ds-food-result-row__value--unavailable">{unavailableLabel}</span>
      ) : (
        <span className="ds-food-result-row__value">
          {/* Spoken as one value; the stacked figure and unit are visual only. */}
          <span className="ds-sr-only">{kcal} {unit}</span>
          <span aria-hidden="true">{kcal}</span>
          <span className="ds-food-result-row__unit" aria-hidden="true">{unit}</span>
        </span>
      )}
    </button>
  </li>
);

export const FoodResultList = ({ children, label = 'Search results' }) => (
  <ul className="ds-food-result-list" aria-label={label}>{children}</ul>
);
