import { useState } from 'react';
import './RecipeDetail.css';
import {
  NavBar, FoodImage, Stepper, IngredientRow, IngredientList, MethodList,
  MethodStep, NutritionSummary, Banner, Button, Skeleton,
} from '../../index';
import { Screen } from '../Screen/Screen';
import { roastSquashLentils, sesameFlag } from '../flow2Data';

/**
 * SCREEN 4 — Recipe Detail.
 *
 * "Show one recipe in full — ingredients, method, per-serving nutrition — so
 * the user can decide to cook it." (SCREENS.md)
 *
 * A drill-down: back control, no tab bar. One dedicated state — there is no
 * second layout here to design — so everything else is a content variation on
 * the same readable scroll.
 *
 * Its nutrition block is Screen 2's, summarised. That single overlap is what
 * makes the two stories one app, so it goes through `NutritionSummary` with
 * `variant="summary"` rather than being rebuilt.
 *
 * `state`: ready | loading | error
 */
export const RecipeDetail = ({
  recipe = roastSquashLentils,
  state = 'ready',
  flagged = false,
  /* Opens the screen at a yield other than the recipe's own, so the scaled
     state is reviewable without driving the stepper. */
  initialServings,
  /* A drill-down always has a way back; the default keeps the control present
     in a story, where there is no screen behind this one to return to. */
  onBack = () => {},
  onSeeBreakdown,
}) => {
  const [servings, setServings] = useState(initialServings ?? recipe.baseServings);
  const [pending, setPending] = useState(false);

  /* Scaling a recipe scales its servings with it, so the per-serving figures
     are invariant: what moves is each ingredient amount and the label on the
     portion cell. Changing servings sets `pending` so the figures transition
     in place rather than behind a spinner. */
  const factor = servings / recipe.baseServings;
  const scale = (n) => Math.round(n * factor);

  const setServingsLive = (next) => {
    setPending(true);
    setServings(next);
    // The recalculation is instant; `pending` is what makes it legible.
    window.setTimeout(() => setPending(false), 260);
  };

  const failed = state === 'error';
  const macros = failed ? { protein: null, carbs: null, fat: null } : recipe.macros;

  return (
    <Screen
      label="Recipe Detail"
      /* No pinned band. This is a reading screen, not a task screen: a
         persistent bar would cost 131px of every viewport and would follow the
         reader through the method, where it has nothing to do with what is on
         screen. The one bridge out lives in the content instead — see below. */
    >
      {/* Back only, and sticky. No title: the recipe name is the largest thing
          on the screen a moment later, and repeating it in a 22px bar would
          both compete with the heading and truncate — a realistic name needs
          646px in a bar that has 300.

          It sticks because this screen is long — hero, nutrition, nine
          ingredients, seven steps — and a reader deep in the method otherwise
          has no way back on screen at all. The bar sits at the top of the
          scroll box, which is already below the screen's safe-area padding. */}
      <div className="screen-sticky-top rd-topbar">
        <NavBar onBack={onBack} backLabel="Back to recipes" />
      </div>

      {/* The hero runs to both screen edges and loses its radius there. */}
      <div className="rd-hero">
        {state === 'loading'
          ? <Skeleton height={260} shape="media" />
          : (
            <FoodImage
              src={recipe.image}
              crop="landscape"
              flush
              focalX={recipe.focal?.x}
              focalY={recipe.focal?.y}
              scale={recipe.focal?.scale}
              alt=""
            />
          )}
      </div>

      <h1 className="rd-title">{recipe.title}</h1>

      <p className="rd-meta">
        <span>{recipe.minutes} min</span>
        <span>{recipe.baseServings} servings</span>
        <span>{recipe.diet}</span>
      </p>

      {failed && (
        <div className="rd-banner">
          <Banner
            tone="error"
            title="The nutrition did not load"
            body="The recipe itself is complete."
            actionLabel="Retry"
            onAction={() => {}}
          />
        </div>
      )}

      {/* Servings first: it governs the amounts and the serving label below it,
          so it reads before the figures it changes. */}
      <div className="screen-section rd-servings">
        <Stepper
          label="Servings"
          value={servings}
          min={1}
          max={12}
          onChange={setServingsLive}
          formatValue={(v) => `${v}`}
        />
      </div>

      {/* The nutrition block is Screen 2's, summarised. */}
      <section className="screen-section">
        {state === 'loading' ? (
          <LoadingNutrition />
        ) : (
          <NutritionSummary
            variant="summary"
            title="Per serving"
            kcal={recipe.kcalPerServing}
            portion={`1 of ${servings} servings`}
            per100={failed ? null : recipe.per100}
            macros={macros}
            pending={pending}
          />
        )}

        {/* The bridge to Screen 2. It does not reveal a breakdown — that is
            already on this screen — it opens these figures in the US1
            calculator, where the portion can be changed and a mis-matched item
            swapped. So it sits with the figures it acts on and scrolls away
            with them, rather than following the reader down the page. */}
        {state !== 'loading' && (
          <div className="screen-actions">
            <Button variant="secondary" fullWidth onClick={onSeeBreakdown}>Adjust in calculator</Button>
          </div>
        )}
      </section>

      <section className="screen-section">
        <h2 className="rd-section-title">Ingredients</h2>
        <p className="screen-note rd-yield">
          For {servings} {servings === 1 ? 'serving' : 'servings'}
        </p>
        {state === 'loading' ? (
          <LoadingRows />
        ) : (
          <IngredientList label="Ingredients">
            {recipe.ingredients.map((item) => (
              <IngredientRow
                key={item.id}
                name={item.name}
                amount={`${scale(item.qty)} ${item.unit}`}
                kcal={scale(item.kcal)}
                flag={flagged && item.id === sesameFlag.id ? sesameFlag.flag : undefined}
              />
            ))}
          </IngredientList>
        )}
      </section>

      {state !== 'loading' && (
        <section className="screen-section">
          <h2 className="rd-section-title">Method</h2>
          <div className="rd-method">
            <MethodList label="Method">
              {recipe.method.map((step) => <MethodStep key={step}>{step}</MethodStep>)}
            </MethodList>
          </div>
        </section>
      )}

      {state !== 'loading' && <p className="screen-note rd-note">{recipe.note}</p>}
    </Screen>
  );
};

/* Progressive fill from the card the user tapped: the title, the time, the
   servings and the diet all arrived with it, so only the figures the card
   could not carry are still loading. Each bar holds the box its value will
   occupy — the same contract the Flow 1 skeletons hold. */
const LoadingNutrition = () => (
  <div className="rd-loading-nutrition" role="status" aria-label="Loading nutrition">
    <Skeleton width={120} height={22} />
    <Skeleton width={168} height={56} style={{ marginTop: 16 }} />
    <div className="rd-loading-pair">
      <span><Skeleton width={96} height={29} /><Skeleton width={70} height={21.8} style={{ marginTop: 5 }} /></span>
      <span><Skeleton width={96} height={29} /><Skeleton width={70} height={21.8} style={{ marginTop: 5 }} /></span>
    </div>
    <div className="rd-loading-macros">
      {[0, 1, 2].map((i) => (
        <span key={i}>
          <Skeleton width="72%" height={24} />
          <Skeleton width="54%" height={21.8} style={{ marginTop: 9 }} />
        </span>
      ))}
    </div>
  </div>
);

const LoadingRows = () => (
  <div className="rd-loading-rows" role="status" aria-label="Loading ingredients">
    {[0, 1, 2, 3, 4].map((i) => (
      <span className="rd-loading-row" key={i}>
        <Skeleton width={`${62 - i * 5}%`} height={22} />
        <Skeleton width={44} height={22} />
      </span>
    ))}
  </div>
);
