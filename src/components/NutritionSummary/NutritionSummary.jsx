import './NutritionSummary.css';
import { HeroCalories } from '../HeroCalories/HeroCalories';
import { PortionPair } from '../PortionPair/PortionPair';
import { MacroGroup } from '../MacroGroup/MacroGroup';
import { MacroEnergySplit } from '../MacroEnergySplit/MacroEnergySplit';
import { IngredientRow, IngredientList } from '../IngredientRow/IngredientRow';

/**
 * NutritionSummary — the one nutrition block in the product.
 *
 *  variant="full"     Nutrition Result. 76px hero, the full ladder.
 *  variant="summary"  Recipe Detail. 56px hero, tighter rhythm, no ingredient
 *                     list (the recipe has its own, further up the page).
 *
 * `basis` takes the Portion / Per 100 g segmented control. It sits beside the
 * section title, not above the hero, so nothing separates the heading from the
 * number it heads.
 *
 * `pending` is the recalculating state: the figures dim in place while a new
 * portion is applied. There is deliberately no blocking spinner.
 */
export const NutritionSummary = ({
  title,
  basis,
  kcal,
  unit = 'kcal',
  portion,
  per100,
  macros,
  ingredients,
  ingredientsLabel = 'Ingredients',
  variant = 'full',
  pending = false,
  note,
  onIngredientClick,
}) => (
  <section
    className={['ds-nutrition', `ds-nutrition--${variant}`].filter(Boolean).join(' ')}
    aria-busy={pending || undefined}
  >
    {(title || basis) && (
      <div className="ds-nutrition__head">
        {title && <h2 className="ds-nutrition__title">{title}</h2>}
        {basis}
      </div>
    )}

    <div className="ds-nutrition__hero">
      <HeroCalories value={kcal} unit={unit} size={variant === 'full' ? 'lg' : 'md'} pending={pending} />
    </div>

    {(portion !== undefined || per100 !== undefined) && (
      <div className="ds-nutrition__pair">
        <PortionPair portion={portion} per100={per100} />
      </div>
    )}

    {macros && (
      <div className="ds-nutrition__macros">
        {/* Where the calories come from, above the exact grams. Renders
            nothing unless all three macros are known. */}
        <MacroEnergySplit macros={macros} pending={pending} />
        <MacroGroup macros={macros} pending={pending} />
      </div>
    )}

    {variant === 'full' && ingredients?.length > 0 && (
      <div className="ds-nutrition__ingredients">
        <p className="ds-nutrition__section-label">{ingredientsLabel}</p>
        <IngredientList label={ingredientsLabel}>
          {ingredients.map((item) => (
            <IngredientRow
              key={item.id}
              name={item.name}
              amount={item.amount}
              kcal={item.kcal}
              flag={item.flag}
              onClick={onIngredientClick ? () => onIngredientClick(item) : undefined}
            />
          ))}
        </IngredientList>
      </div>
    )}

    {note && <p className="ds-nutrition__note">{note}</p>}
  </section>
);
