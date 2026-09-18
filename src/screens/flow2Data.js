/**
 * Flow 2 content — "find a recipe for a dish that is suitable for me".
 *
 * Screen-level sample content, kept apart from `src/lib/sampleData.js` so the
 * design system's own specimens stay exactly as they were reviewed, and apart
 * from `flow1Data.js` so each flow's figures can be checked on their own.
 *
 * Every recipe carries its own plausible energy: a 15-minute grain salad and a
 * 45-minute stew do not land on the same number. Ingredient calories sum to
 * the stated per-serving figure, and macro grams are consistent with it at
 * 4 / 4 / 9. A value the database does not have is `null` and is printed in
 * words — never as a zero.
 *
 * Photography is the approved set in `assets/food/`, addressed through the
 * same `img()` helper the design system uses, each with its own focal point.
 */
import { img } from '../lib/sampleData';

/* ------------------------------------------------------- Recipe Discovery */

/** The unfiltered landing list. */
export const recipes = [
  {
    id: 'roast-squash-lentils',
    title: 'Roast squash & red lentils',
    minutes: 35,
    servings: 4,
    diet: 'Vegetarian',
    kcalPerServing: 510,
    image: img('lentil-squash-bowl'),
    focal: { x: 58, y: 52, scale: 1.12 },
  },
  {
    id: 'herb-grain-salad',
    title: 'Herb, cucumber & cracked wheat salad',
    minutes: 15,
    servings: 2,
    diet: 'Vegan',
    kcalPerServing: 297,
    image: img('vegetable-grain-bowl'),
    focal: { x: 48, y: 52, scale: 1.06 },
  },
  {
    id: 'citrus-barley',
    title: 'Citrus, barley & pistachio',
    minutes: 25,
    servings: 2,
    diet: 'Vegan',
    kcalPerServing: 438,
    image: img('citrus-grain-bowl'),
    focal: { x: 62, y: 58, scale: 1.16 },
  },
  {
    id: 'chickpea-herb',
    title: 'Chickpea, herb & preserved lemon bowl',
    minutes: 20,
    servings: 2,
    diet: 'Vegan',
    kcalPerServing: 389,
    image: img('chickpea-bowl'),
    focal: { x: 56, y: 50, scale: 1.12 },
  },
  {
    id: 'lentil-soup',
    title: 'Lentil & vegetable soup with lemon',
    minutes: 40,
    servings: 6,
    diet: 'Vegan',
    kcalPerServing: 246,
    image: img('lentil-vegetable-soup'),
    focal: { x: 52, y: 54, scale: 1.08 },
  },
  {
    id: 'squash-couscous',
    title: 'Squash & couscous with feta',
    minutes: 30,
    servings: 4,
    diet: 'Vegetarian',
    kcalPerServing: 474,
    image: img('squash-couscous-bowl'),
    focal: { x: 44, y: 60, scale: 1.12 },
  },
  {
    id: 'spiced-lentil-stew',
    title: 'Spiced lentil stew',
    minutes: 45,
    servings: 4,
    diet: 'Vegan',
    kcalPerServing: 318,
    image: img('lentil-stew'),
    focal: { x: 60, y: 56, scale: 1.06 },
  },
];

/**
 * The filters in force, as they read under the search field. Quantitative
 * labels are shortened so three fit on one line; semantic ones are left as
 * written. DESIGN_SYSTEM.md §3.
 */
export const appliedFilters = ['Vegan', '<400 kcal', 'No nuts', '<30 min'];

/** What survives those four filters: vegan, under 400, no nuts, under 30 min. */
export const filteredRecipes = recipes.filter((r) => r.id === 'herb-grain-salad' || r.id === 'chickpea-herb');

/** The values the filter sheet offers. */
export const filterOptions = {
  diet: ['Vegan', 'Vegetarian', 'Pescatarian', 'Gluten free'],
  exclude: ['Nuts', 'Dairy', 'Egg', 'Soy', 'Sesame'],
  kcal: [
    { value: '400', label: '< 400' },
    { value: '500', label: '< 500' },
    { value: 'any', label: 'Any' },
  ],
  time: [
    { value: '15', label: '< 15 min' },
    { value: '30', label: '< 30 min' },
    { value: 'any', label: 'Any' },
  ],
};

/**
 * The binding constraint when the list empties. SCREENS.md calls this the most
 * important empty state in the app: it has to name *which* filter is doing the
 * damage and offer to relax that one, not suggest starting again.
 */
export const bindingConstraint = {
  lead: 'Under 15 minutes is the filter doing this.',
  detail: ' Everything else you have set matches four recipes. Allowing 30 minutes brings all four back.',
};

/* ------------------------------------------------------------ Recipe Detail */

/**
 * The recipe as written, for its stated yield of 4 servings. Ingredient
 * calories sum to 2,038 — 510 per serving.
 *
 * `qty` scales with the servings control; `kcal` scales with it too, because
 * the figure belongs to the amount rather than to the recipe.
 */
export const roastSquashLentils = {
  id: 'roast-squash-lentils',
  title: 'Roast squash & red lentils',
  minutes: 35,
  baseServings: 4,
  diet: 'Vegetarian',
  image: img('lentil-squash-bowl'),
  focal: { x: 58, y: 52, scale: 1.12 },
  kcalPerServing: 510,
  servingWeight: 340,
  per100: '150 kcal',
  macros: { protein: 19, carbs: 57, fat: 22 },
  ingredients: [
    { id: 'squash', name: 'Butternut squash, peeled and cubed', qty: 720, unit: 'g', kcal: 461 },
    { id: 'lentils', name: 'Red lentils, dry', qty: 240, unit: 'g', kcal: 835 },
    { id: 'onion', name: 'Onion, finely sliced', qty: 180, unit: 'g', kcal: 72 },
    { id: 'garlic', name: 'Garlic', qty: 9, unit: 'g', kcal: 13 },
    { id: 'cumin', name: 'Ground cumin', qty: 4, unit: 'g', kcal: 15 },
    { id: 'oil', name: 'Olive oil', qty: 30, unit: 'g', kcal: 270 },
    { id: 'tahini', name: 'Tahini', qty: 60, unit: 'g', kcal: 357 },
    { id: 'lemon', name: 'Lemon juice', qty: 30, unit: 'g', kcal: 8 },
    { id: 'parsley', name: 'Flat-leaf parsley', qty: 20, unit: 'g', kcal: 7 },
  ],
  method: [
    'Heat the oven to 200°C fan. Toss the squash with half the olive oil, the cumin and a good pinch of salt, and spread it out on a large tray.',
    'Roast for 25 minutes, turning once, until the edges catch and a knife slides through without resistance.',
    'Meanwhile, rinse the lentils until the water runs clear. Put them in a pan with 700 ml of water and bring to a simmer.',
    'Cook the lentils for 18–20 minutes, stirring now and then, until they collapse into a loose purée. Season generously.',
    'Soften the onion and garlic in the remaining oil over a low heat for 10 minutes, until sweet rather than coloured.',
    'Fold the onion through the lentils, spoon the squash over the top, and finish with the tahini loosened with lemon juice and a little water.',
    'Scatter with parsley and serve warm.',
  ],
  note: 'Per-serving figures are estimated from a verified database entry for each ingredient. They hold whatever yield you cook, because scaling a recipe scales the servings with it.',
};

/** The ingredient that conflicts with an active exclusion, and what it says. */
export const sesameFlag = {
  id: 'tahini',
  flag: 'Contains sesame, which you excluded',
};

/**
 * A user-submitted recipe the database holds calories for and nothing else.
 * Fewer figures, each missing one stated in words — never a zero.
 */
export const canteenDahl = {
  id: 'canteen-dahl',
  title: 'Canteen lentil dahl',
  minutes: 30,
  baseServings: 6,
  diet: 'Vegan',
  image: img('lentil-stew'),
  focal: { x: 58, y: 54, scale: 1.08 },
  kcalPerServing: 268,
  servingWeight: null,
  per100: null,
  macros: { protein: 14, carbs: null, fat: null },
  ingredients: [
    { id: 'lentils', name: 'Red lentils, dry', qty: 400, unit: 'g', kcal: 1392 },
    { id: 'tomato', name: 'Chopped tomatoes', qty: 400, unit: 'g', kcal: 72 },
    { id: 'onion', name: 'Onion', qty: 200, unit: 'g', kcal: 80 },
    { id: 'spice', name: 'Curry powder', qty: 12, unit: 'g', kcal: 38 },
    { id: 'oil', name: 'Rapeseed oil', qty: 20, unit: 'g', kcal: 180 },
    { id: 'coriander', name: 'Coriander', qty: 15, unit: 'g', kcal: 5 },
  ],
  method: [
    'Soften the onion in the oil over a medium heat until translucent.',
    'Stir in the curry powder and cook for a minute, until it smells toasted rather than raw.',
    'Add the lentils, the tomatoes and 1.2 litres of water. Simmer for 25 minutes, stirring so nothing catches.',
    'Season, and finish with the coriander.',
  ],
  note: 'This entry was submitted by a user. It carries a calorie figure but no carbohydrate or fat breakdown, and no serving weight to work a per-100 g figure from.',
};
