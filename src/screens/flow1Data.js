/**
 * Flow 1 content — "Calculate the calories in a dish or a product".
 *
 * Screen-level sample content, kept apart from `src/lib/sampleData.js` so the
 * design system's own specimens stay exactly as they were reviewed. Every
 * figure here is plausible on its own terms: a pouch of ready-to-eat lentils
 * and a bowl of couscous do not contain the same energy, and macro grams are
 * consistent with their calorie totals at 4 / 4 / 9.
 *
 * Nothing that the database does not have is written as a zero. A value the
 * product does not know is `null`, and every component prints that in words.
 *
 * Photography is the approved set in `assets/food/`, addressed through the
 * same `img()` helper the design system uses, and every entry carries its own
 * focal point so the crop travels with the dish.
 */
import { img } from '../lib/sampleData';

/* ------------------------------------------------------------ Food Search */

/** The query the populated states are built around. */
export const query = 'lentil';

/** Committed search — the results body of Screen 1. */
export const results = [
  {
    id: 'puy-ready',
    name: 'Puy lentils, ready to eat',
    source: 'Merchant Gourmet · per 250 g pouch',
    kcal: 298,
    image: img('roasted-lentils-detail'),
    focal: { x: 52, y: 48, scale: 1.08 },
  },
  {
    id: 'red-dry',
    name: 'Red lentils, dry',
    source: 'Generic · per 60 g',
    kcal: 209,
    image: img('dry-red-lentils'),
    focal: { x: 50, y: 50 },
  },
  {
    id: 'soup',
    name: 'Lentil & vegetable soup',
    source: 'Covent Garden · per 400 g pot',
    kcal: 246,
    image: img('lentil-vegetable-soup'),
    focal: { x: 52, y: 54, scale: 1.08 },
  },
  {
    id: 'stew',
    name: 'Spiced lentil stew',
    source: 'Homemade · per 350 g bowl',
    kcal: 318,
    image: img('lentil-stew'),
    focal: { x: 60, y: 56, scale: 1.06 },
  },
  {
    id: 'squash-lentils',
    name: 'Roast squash & red lentils',
    source: 'Homemade dish · 4 items',
    kcal: 512,
    image: img('lentil-squash-bowl'),
    focal: { x: 58, y: 52, scale: 1.12 },
  },
  {
    // A real database entry whose breakdown was never captured. It is listed
    // as a match like any other; what it cannot say, it says in words.
    id: 'dahl-canteen',
    name: 'Lentil dahl, canteen serving',
    source: 'User submitted · per 300 g',
    kcal: null,
    image: img('chickpea-bowl'),
    focal: { x: 56, y: 50, scale: 1.14 },
  },
];

/** Mid-typing. The same list, shorter, because the query is not finished. */
export const suggestions = results.slice(0, 4);

/** What the user typed when nothing came back. A brand, a flavour and a pack
 *  size — the shape of query that a food database reliably fails on. */
export const deadQuery = 'tesco creamy lentil dahl 400g';

/** The two searches the no-results state offers, in SCREENS.md's order:
 *  broaden the query first, then a related term. */
export const broadenedQuery = 'lentil dahl';
export const relatedQuery = 'red lentil curry';

/** A barcode that the database has no entry for. */
export const scannedBarcode = '5 018374 812309';

/* -------------------------------------------------------- Nutrition Result */

/**
 * The single-item case: a branded pouch. SCREENS.md asks this to read as a
 * clean product readout rather than a one-row list.
 *   298 kcal ≈ 21 × 4 + 44 × 4 + 3.5 × 9
 */
export const puyLentils = {
  id: 'puy-ready',
  eyebrow: 'Product',
  name: 'Puy lentils, ready to eat',
  source: 'Merchant Gourmet · 250 g pouch',
  kcal: 298,
  grams: 250,
  portion: '250 g',
  per100: '119 kcal',
  macros: { protein: 21, carbs: 44, fat: 3.5 },
  macrosPer100: { protein: 8.4, carbs: 17.6, fat: 1.4 },
  kcalPer100: 119,
  image: img('roasted-lentils-detail'),
  focal: { x: 52, y: 48, scale: 1.1 },
  note: 'From a verified database entry. The portion is the largest source of variation, and you can change it.',
};

/** Alternatives for the item-swap sheet. The entry the user opened the sheet
 *  to reject is deliberately not among them. */
export const puyAlternatives = [
  {
    id: 'puy-dry',
    name: 'Puy lentils, dry',
    source: 'Merchant Gourmet · per 60 g',
    kcal: 197,
    image: img('dry-red-lentils'),
    focal: { x: 50, y: 50 },
  },
  {
    id: 'green-canned',
    name: 'Green lentils, canned, drained',
    source: 'Bonduelle · per 130 g',
    kcal: 139,
    image: img('lentil-stew'),
    focal: { x: 58, y: 54, scale: 1.06 },
  },
  {
    id: 'beluga',
    name: 'Beluga lentils, cooked',
    source: 'Generic · per 200 g',
    kcal: 232,
    image: img('roasted-lentils-detail'),
    focal: { x: 46, y: 52, scale: 1.05 },
  },
];

/**
 * The multi-item case: a homemade dish assembled through the "add another
 * item" loop. 115 + 214 + 79 + 3 + 131 = 542 kcal over 453 g.
 */
export const couscousDishItems = [
  { id: 'squash', name: 'Butternut squash, roasted', amount: '180 g', kcal: 115, grams: 180 },
  { id: 'couscous', name: 'Couscous, dry', amount: '60 g', kcal: 214, grams: 60 },
  { id: 'feta', name: 'Feta', amount: '30 g', kcal: 79, grams: 30 },
  { id: 'parsley', name: 'Flat-leaf parsley', amount: '8 g', kcal: 3, grams: 8 },
  { id: 'walnuts', name: 'Walnuts, toasted', amount: '20 g', kcal: 131, grams: 20 },
];

export const couscousDish = {
  id: 'squash-couscous',
  eyebrow: 'Dish',
  name: 'Squash & couscous with feta',
  source: 'Built from 5 items',
  kcal: 542,
  grams: 453,
  portion: '453 g',
  per100: '120 kcal',
  macros: { protein: 17, carbs: 62, fat: 24 },
  macrosPer100: { protein: 3.8, carbs: 13.7, fat: 5.3 },
  kcalPer100: 120,
  items: couscousDishItems,
  image: img('squash-couscous-bowl'),
  focal: { x: 44, y: 60, scale: 1.12 },
  note: 'Each item is an estimate from a verified database entry. Change an amount to see the total follow it.',
};

/** The same dish after the walnuts were removed: 542 − 131 = 411 kcal, 433 g. */
export const couscousDishReduced = {
  ...couscousDish,
  source: 'Built from 4 items',
  kcal: 411,
  grams: 433,
  portion: '433 g',
  per100: '95 kcal',
  kcalPer100: 95,
  macros: { protein: 14, carbs: 59, fat: 12 },
  macrosPer100: { protein: 3.2, carbs: 13.6, fat: 2.8 },
  items: couscousDishItems.filter((i) => i.id !== 'walnuts'),
};

/** Alternatives offered when a dish item turns out to be the wrong match. */
export const itemAlternatives = [
  {
    id: 'feta-reduced',
    name: 'Feta, reduced fat',
    source: 'Sainsbury\u2019s · per 30 g',
    kcal: 55,
    image: img('tahini-dip'),
    focal: { x: 50, y: 46, scale: 1.08 },
  },
  {
    id: 'halloumi',
    name: 'Halloumi, grilled',
    source: 'Generic · per 30 g',
    kcal: 97,
    image: img('squash-wedge'),
    focal: { x: 52, y: 48, scale: 1.06 },
  },
  {
    id: 'ricotta',
    name: 'Ricotta',
    source: 'Galbani · per 30 g',
    kcal: 42,
    image: img('tahini-dip'),
    focal: { x: 54, y: 50, scale: 1.12 },
  },
];

/**
 * An entry the database holds calories for and nothing else. SCREENS.md makes
 * this a component variation rather than a layout: fewer figures, each missing
 * one stated in words. A zero here would be a claim about the food.
 */
export const marketFalafel = {
  id: 'falafel-wrap',
  eyebrow: 'Product',
  name: 'Falafel wrap, market stall',
  source: 'User submitted · 1 wrap',
  kcal: 604,
  grams: null,
  portion: '1 wrap',
  per100: null,
  kcalPer100: null,
  macros: { protein: 21, carbs: null, fat: null },
  macrosPer100: { protein: null, carbs: null, fat: null },
  image: img('chickpea-bowl'),
  focal: { x: 56, y: 50, scale: 1.14 },
  note: 'This entry carries a calorie figure but no carbohydrate or fat breakdown, and no weight to work a per-100 g figure from.',
};
