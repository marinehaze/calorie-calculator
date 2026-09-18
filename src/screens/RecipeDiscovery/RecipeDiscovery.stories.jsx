import { RecipeDiscovery } from './RecipeDiscovery';
import { appliedFilters } from '../flow2Data';

export default {
  title: 'Screens/Recipe Discovery',
  component: RecipeDiscovery,
  /* Review-only device stage — see .storybook/preview.css. */
  parameters: { layout: 'fullscreen', deviceFrame: true, backgrounds: { value: 'stage' } },
};

/** ◆ Dedicated — browse / results.
 *
 *  The landing state and the screen's main layout. An unfiltered list is a
 *  valid starting point: SCREENS.md dropped "preferences not yet set" because
 *  with no persistence there is nothing to set up front.
 *
 *  A root screen, so the tab bar stays and the nav bar is a plain header —
 *  title and the filter action, no back control. */
export const Browse = {
  name: 'Browse / results ◆',
  render: () => <RecipeDiscovery state="browse" />,
};

/** · Filters applied. The same list with fewer cards, and the filters in force
 *  visible as chips under the search field — the whole chip removes one in a
 *  tap. The four wrap onto two lines rather than scrolling sideways. */
export const FiltersApplied = {
  name: 'Filters applied',
  render: () => <RecipeDiscovery state="filtered" filters={appliedFilters} />,
};

/** ◆ Dedicated — the filter sheet.
 *
 *  A sheet, not a screen, but the surface that carries the entire meaning of
 *  "suitable for me" and the one that replaced a dedicated preferences screen.
 *  Diet and exclusions are toggle chips; the two quantitative constraints are
 *  segmented controls, because each is one choice from a short bounded range.
 *  The footer action stays put while the body scrolls. */
export const FilterSheet = {
  name: 'Filter sheet ◆',
  render: () => <RecipeDiscovery state="filtered" filters={appliedFilters} sheet />,
};

/** ◆ Dedicated — no matching recipes.
 *
 *  SCREENS.md calls this the most important empty state in the app. It names
 *  the single filter doing the damage — under 15 minutes — and offers to relax
 *  that one specifically, rather than suggesting the user start again. The
 *  berry rule on the insight is the same 2px idiom that marks a flagged
 *  ingredient. */
export const NoMatches = {
  name: 'No matching recipes ◆',
  render: () => <RecipeDiscovery state="empty" filters={['Vegan', '<400 kcal', 'No nuts', '<15 min']} />,
};

/** · Loading. Skeleton cards in the same boxes the recipes will occupy, and
 *  the search field carries its own spinner. */
export const Loading = {
  name: 'Loading · skeleton cards',
  render: () => <RecipeDiscovery state="loading" query="squash" />,
};

/** · Offline. The shared banner, over the last good list. role="status", so a
 *  standing notice does not interrupt. */
export const Offline = {
  name: 'Offline',
  render: () => <RecipeDiscovery state="offline" />,
};

/** · Error. The same banner at role="alert", because this has just happened,
 *  and it does not block the results already on screen. */
export const ErrorState = {
  name: 'Error · search did not complete',
  render: () => <RecipeDiscovery state="error" query="squash" />,
};
