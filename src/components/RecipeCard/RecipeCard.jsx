import './RecipeCard.css';
import { FoodImage } from '../FoodImage/FoodImage';

/**
 * RecipeCard — a recipe in the Discovery list.
 *
 * Deliberately not a box: media with a radius, then type directly on the
 * screen's ground. A container around every recipe would turn the list into
 * the ecommerce grid this direction avoids, and the photography already does
 * the separating.
 *
 * One density only. SCREENS.md gives Recipe Discovery a single list layout —
 * "filters applied" is the same list with fewer cards, not a denser one.
 */
export const RecipeCard = ({
  title,
  minutes,
  servings,
  diet,
  kcalPerServing,
  image,
  focal,
  onClick,
  ...rest
}) => (
  <li>
    <button type="button" className="ds-recipe-card" onClick={onClick} {...rest}>
      <span className="ds-recipe-card__media">
        <FoodImage
          src={image}
          crop="landscape"
          focalX={focal?.x}
          focalY={focal?.y}
          scale={focal?.scale}
        />
      </span>
      <span className="ds-recipe-card__body">
        <span className="ds-recipe-card__title">{title}</span>
        <span className="ds-recipe-card__meta">
          {minutes != null && <span>{minutes} min</span>}
          {servings != null && <span>{servings} servings</span>}
          {diet && <span>{diet}</span>}
        </span>
        {kcalPerServing != null && (
          <span className="ds-recipe-card__kcal">
            <b className="ds-num">{kcalPerServing}</b>
            <span>kcal per serving</span>
          </span>
        )}
      </span>
    </button>
  </li>
);

export const RecipeList = ({ children, label = 'Recipes' }) => (
  <ul className="ds-recipe-list" aria-label={label}>{children}</ul>
);
