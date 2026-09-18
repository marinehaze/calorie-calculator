import { NutritionResult } from './NutritionResult';
import { puyLentils, couscousDish, couscousDishReduced, marketFalafel } from '../flow1Data';

export default {
  title: 'Screens/Nutrition Result',
  component: NutritionResult,
  /* `deviceFrame` is review-only presentation: a stage behind the 390px
     frame, a drop shadow, and a simulated bottom safe area with a home
     indicator. A desktop browser reports env(safe-area-inset-bottom) as 0,
     so without it the tab bar and the pinned action band cannot be judged
     at the size they take on a handset. See .storybook/preview.css. */
  parameters: { layout: 'fullscreen', deviceFrame: true, backgrounds: { value: 'stage' } },
};

/** ◆ Dedicated — single item.
 *
 *  The dominant case, and a distinct layout problem: it has to read as a clean
 *  product readout rather than a one-row list. The template holds at n = 1
 *  because there is no list to hold — the item's own portion *is* the screen's
 *  portion, so the item row would have said what the hero already says.
 *
 *  No tab bar: this is a drill-down, and a lateral move out of a task in
 *  progress is not something the screen should offer. No title in the nav bar
 *  either — the dish name is already the largest thing on the screen. */
export const SingleItem = {
  name: 'Single item ◆',
  render: () => <NutritionResult dish={puyLentils} />,
};

/** · The portion sheet. One question and one consequence: unit, amount, and
 *  what it comes to. The unit switch is the text variant because the stepper
 *  below it is what gets touched; the total recalculates live behind the
 *  sheet, with no confirm step. */
export const PortionSheet = {
  name: 'Single item · portion sheet',
  render: () => <NutritionResult dish={puyLentils} sheet="portion" />,
};

/** · The item-swap sheet — Screen 1's result list inside a sheet, exactly as
 *  SCREENS.md specifies. The match the user opened the sheet to reject is not
 *  among the alternatives. */
export const SwapSheet = {
  name: 'Single item · item swap sheet',
  render: () => <NutritionResult dish={puyLentils} sheet="swap" />,
};

/** · Recalculating after a portion edit. Every figure dims in place and the
 *  numbers transition where they stand. There is no blocking spinner anywhere
 *  in this product. */
export const Recalculating = {
  name: 'Single item · recalculating',
  render: () => (
    <NutritionResult
      state="recalculating"
      dish={{
        ...puyLentils,
        kcal: 381,
        grams: 320,
        portion: '320 g',
        macros: { protein: 27, carbs: 56, fat: 4.5 },
        macrosPer100: { protein: 8.4, carbs: 17.6, fat: 1.4 },
      }}
    />
  ),
};

/** · Loading, as progressive fill rather than a blank screen. The name and the
 *  calorie figure arrived with the tapped search row, so they are already on
 *  screen; only the figures the row could not carry are still skeletons, each
 *  holding the box its value will occupy. */
export const Loading = {
  name: 'Single item · loading',
  render: () => <NutritionResult state="loading" dish={puyLentils} />,
};

/** · Error. The shared banner, over what is already known. The macros the
 *  request failed to fetch say "Not available" — the screen never fills a gap
 *  it could not load with a zero. */
export const ErrorState = {
  name: 'Single item · error',
  render: () => <NutritionResult state="error" dish={puyLentils} />,
};

/** · Incomplete nutrition data. A real database entry with a calorie figure,
 *  no carbohydrate or fat breakdown, and no weight to work a per-100 g figure
 *  from. Fewer figures, each missing one stated in words, and the Per 100 g
 *  option disabled rather than showing a number that does not exist. A
 *  component variation, not a different layout. */
export const IncompleteData = {
  name: 'Single item · incomplete data',
  render: () => <NutritionResult dish={marketFalafel} />,
};

/** ◆ Dedicated — multi-item dish.
 *
 *  Genuinely a different layout, not the single-item template stretched: a row
 *  per item carrying its own amount and its contribution, under a head that
 *  sticks to the top of the scrolling body so the running total stays visible
 *  however long the list grows. Scroll the frame to see it hold.
 *
 *  Tapping a row opens that item's sheet — amount, swap, or take it out. */
export const MultiItem = {
  name: 'Multi-item dish ◆',
  render: () => <NutritionResult dish={couscousDish} />,
};

/** · One item's sheet, opened from its row. It carries the same portion
 *  control as the single-item case plus the two other decisions that belong to
 *  that row, because a separate sheet for each would turn a decision into a
 *  destination. */
export const ItemSheet = {
  name: 'Multi-item dish · item sheet',
  render: () => <NutritionResult dish={couscousDish} sheet="portion" sheetItem={couscousDish.items[2]} />,
};

/** · An item removed from the dish. The row leaves, the total recalculates,
 *  and the item count in the eyebrow follows it: 542 kcal over five items
 *  becomes 411 over four. */
export const ItemRemoved = {
  name: 'Multi-item dish · item removed',
  render: () => <NutritionResult dish={couscousDishReduced} />,
};
