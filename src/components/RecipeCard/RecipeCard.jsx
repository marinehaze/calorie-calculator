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
 * `compact` is the horizontal variant, for when a longer list needs to be
 * scannable rather than browsable.
 */
export const RecipeCard = ({
  title,
  minutes,
  servings,
  diet,
  kcalPerServing,
  image,
  focal,
  compact = false,
  onClick,
  ...rest
}) => (
  <li>
    <button
      type="button"
      className={['ds-recipe-card', compact && 'ds-recipe-card--compact'].filter(Boolean).join(' ')}
      onClick={onClick}
      {...rest}
    >
      <span className="ds-recipe-card__media">
        <FoodImage
          src={image}
          crop={compact ? 'square' : 'landscape'}
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

export const RecipeList = ({ children, compact = false, label = 'Recipes' }) => (
  <ul className={['ds-recipe-list', compact && 'ds-recipe-list--compact'].filter(Boolean).join(' ')} aria-label={label}>
    {children}
  </ul>
);
