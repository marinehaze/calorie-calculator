/**
 * Realistic example content for stories.
 *
 * The 512 kcal in the stylescape is a *specimen* value for one dish only.
 * Everything else here carries its own plausible figures, so a yoghurt pot and
 * a grain bowl never look like they contain the same energy. Macro grams are
 * roughly consistent with the calorie totals (4/4/9).
 *
 * Photography is the approved set in assets/food/, which Storybook's staticDirs
 * copies to <base>/food in the build.
 *
 * The URL is built from Vite's BASE_URL rather than a root-absolute `/food/`
 * so one helper covers both hosts: BASE_URL is `/` on the dev server and `./`
 * in the static build, where it resolves against iframe.html. A root-absolute
 * path breaks on GitHub Pages, which serves the site from the project subpath
 * /calorie-calculator/ rather than the domain root.
 */

export const img = (name) => `${import.meta.env.BASE_URL}food/${name}.png`;

/* ---------------------------------------------------------- search results */

export const searchResults = [
  {
    id: 'squash-roasted',
    name: 'Butternut squash, roasted',
    source: 'Generic · per 180 g',
    kcal: 115,
    image: img('squash-wedge'),
    focal: { x: 52, y: 48 },
  },
  {
    id: 'yoghurt-greek-0',
    name: 'Greek style yoghurt, 0% fat',
    source: 'Fage Total · per 170 g pot',
    kcal: 97,
    image: img('tahini-dip'),
    focal: { x: 50, y: 46 },
  },
  {
    id: 'lentils-red-dry',
    name: 'Red lentils, dry',
    source: 'Generic · per 60 g',
    kcal: 209,
    image: img('dry-red-lentils'),
    focal: { x: 50, y: 50 },
  },
  {
    id: 'pitta-wholemeal',
    name: 'Wholemeal pitta bread',
    source: "Sainsbury's · per pitta, 75 g",
    kcal: 191,
    image: img('vegetable-grain-bowl'),
    focal: { x: 48, y: 52 },
  },
  {
    id: 'tahini',
    name: 'Tahini, light',
    source: 'Belazu · per 15 g',
    kcal: 89,
    image: img('tahini-dip'),
    focal: { x: 54, y: 50 },
  },
  {
    id: 'halloumi-grilled',
    name: 'Halloumi, grilled',
    source: 'Generic · per 60 g',
    kcal: 194,
    image: img('squash-couscous-bowl'),
    focal: { x: 50, y: 50 },
  },
];

/* --------------------------------------------------------------- nutrition */

/** The stylescape specimen dish — the one place 512 kcal is correct. */
export const roastSquashLentils = {
  name: 'Roast squash & red lentils',
  kcal: 512,
  portion: '340 g',
  per100: '151 kcal',
  macros: { protein: 19, carbs: 58, fat: 22 },
  image: img('lentil-squash-bowl'),
  focal: { x: 58, y: 52, scale: 1.12 },
};

export const greekYoghurt = {
  name: 'Greek style yoghurt, 0% fat',
  kcal: 97,
  portion: '170 g pot',
  per100: '57 kcal',
  macros: { protein: 17, carbs: 6, fat: 0.4 },
  image: img('tahini-dip'),
  focal: { x: 50, y: 46, scale: 1.1 },
};

export const lentilSoup = {
  name: 'Lentil & vegetable soup',
  kcal: 246,
  portion: '400 g bowl',
  per100: '62 kcal',
  macros: { protein: 13, carbs: 36, fat: 4.5 },
  image: img('lentil-vegetable-soup'),
  focal: { x: 52, y: 54, scale: 1.08 },
};

/** A real database entry with calories but no macro breakdown.
 *  SCREENS.md: a missing value says so in words and is never rendered as 0. */
export const marketFalafel = {
  name: 'Falafel wrap, market stall',
  kcal: 604,
  portion: '1 wrap',
  per100: null,
  macros: { protein: 21, carbs: null, fat: null },
  image: img('chickpea-bowl'),
  focal: { x: 56, y: 50, scale: 1.14 },
};

export const ingredients = [
  { id: 'squash', name: 'Butternut squash', amount: '180 g', kcal: 115 },
  { id: 'lentils', name: 'Red lentils, dry', amount: '60 g', kcal: 209 },
  { id: 'tahini', name: 'Tahini', amount: '15 g', kcal: 89 },
  { id: 'oil', name: 'Olive oil', amount: '11 g', kcal: 99 },
];

export const couscousIngredients = [
  { id: 'squash', name: 'Butternut squash', amount: '180 g', kcal: 115 },
  { id: 'couscous', name: 'Couscous, dry', amount: '60 g', kcal: 214 },
  { id: 'feta', name: 'Feta', amount: '30 g', kcal: 79 },
  { id: 'parsley', name: 'Flat-leaf parsley', amount: '8 g', kcal: 3 },
  { id: 'walnut', name: 'Walnuts, toasted', amount: '20 g', kcal: 131 },
];

/* ----------------------------------------------------------------- recipes */

export const recipes = [
  {
    id: 'roast-squash-lentils',
    title: 'Roast squash & red lentils',
    minutes: 35,
    servings: 4,
    diet: 'Vegetarian',
    kcalPerServing: 512,
    image: img('lentil-squash-bowl'),
    focal: { x: 58, y: 52, scale: 1.12 },
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

/* Applied-filter labels. Quantitative ones are shortened ("<400 kcal") because
   they are the widest chips and the abbreviation is unambiguous; semantic ones
   (Vegan, No nuts) stay as written. */
export const activeFilters = ['Vegan', '<400 kcal', 'No nuts', '<30 min'];
