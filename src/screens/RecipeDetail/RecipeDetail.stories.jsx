import { RecipeDetail } from './RecipeDetail';
import { roastSquashLentils, canteenDahl } from '../flow2Data';

export default {
  title: 'Screens/Recipe Detail',
  component: RecipeDetail,
  /* Review-only device stage — see .storybook/preview.css. */
  parameters: { layout: 'fullscreen', deviceFrame: true, backgrounds: { value: 'stage' } },
};

/** ◆ Dedicated — the full recipe.
 *
 *  The screen's reason to exist: ingredients, steps and nutrition in one
 *  readable scroll. There is no second layout here to design.
 *
 *  A drill-down, so the tab bar is replaced by a back control. The nutrition
 *  block is Screen 2's, summarised — the join between the two stories. */
export const FullRecipe = {
  name: 'Full recipe ◆',
  render: () => <RecipeDetail recipe={roastSquashLentils} />,
};

/** · Servings adjusted — the same recipe opened at six servings rather than
 *  its own four.
 *
 *  Scaling a recipe scales its servings with it, so the per-serving figures are
 *  invariant: 510 kcal is 510 kcal whether you cook four portions or six. What
 *  recomputes is every ingredient amount — 720 g of squash becomes 1080 — and
 *  the label on the portion cell. Driving the stepper dims the figures in
 *  place while they settle; there is no blocking spinner. */
export const ServingsAdjusted = {
  name: 'Servings adjusted',
  render: () => <RecipeDetail recipe={roastSquashLentils} initialServings={6} />,
};

/** · An ingredient flagged against an active filter. The tahini conflicts with
 *  an exclusion the user set, so the row carries a berry rule and a sentence.
 *  The sentence is the carrier of meaning; the rule only helps you find it. */
export const IngredientFlagged = {
  name: 'Ingredient flagged',
  render: () => <RecipeDetail recipe={roastSquashLentils} flagged />,
};

/** · Loading, as progressive fill. The title, the time, the yield and the diet
 *  all arrived with the card the user tapped, so they are already on screen;
 *  only the figures the card could not carry are still skeletons. */
export const Loading = {
  name: 'Loading · progressive fill',
  render: () => <RecipeDetail recipe={roastSquashLentils} state="loading" />,
};

/** · Incomplete nutrition. A user-submitted recipe the database holds a
 *  calorie figure for and nothing else: no carbohydrate or fat breakdown, and
 *  no serving weight to work a per-100 g figure from. Each gap is stated in
 *  words. A zero here would be a claim about the food. */
export const IncompleteData = {
  name: 'Incomplete nutrition',
  render: () => <RecipeDetail recipe={canteenDahl} />,
};

/** · Error. The shared banner over a recipe that is otherwise complete — the
 *  method and the ingredients came from the same request that the nutrition
 *  did not. The figures it failed to fetch say "Not available". */
export const ErrorState = {
  name: 'Error · nutrition unavailable',
  render: () => <RecipeDetail recipe={roastSquashLentils} state="error" />,
};
