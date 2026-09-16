import { EmptyState } from './EmptyState';
import { Button } from '../Button/Button';
import { Frame } from '../../lib/Frame';
import { img } from '../../lib/sampleData';
import { IconBarcode } from '../../lib/icons';

export default {
  title: 'Feedback & States/Empty State',
  component: EmptyState,
};

/** Food Search, first run. It has to make search obvious, offer barcode as the
 *  alternative, and set expectations about accuracy — without becoming an
 *  onboarding wall. */
export const FirstRun = {
  render: () => (
    <Frame>
      <EmptyState
        image={img('vegetable-grain-bowl')}
        focal={{ x: 54, y: 52, scale: 1.18 }}
        title="Search a food, or scan a barcode"
        body="Figures come from a verified database. The portion you set is what makes them yours — you can change it at any point."
        actions={<Button variant="secondary" fullWidth iconBefore={<IconBarcode size={20} />}>Scan a barcode</Button>}
      />
    </Frame>
  ),
};

/** Food Search, no results. SCREENS.md calls this the app's key recovery path:
 *  broaden the query, try a related term, or enter values manually. Trust is
 *  lost here if it is a shrug. */
export const NoResults = {
  render: () => (
    <Frame>
      <EmptyState
        title="No match for “quinoa slaw”"
        body="It may be listed under a different name, or as its parts."
        actions={
          <>
            <Button variant="secondary" fullWidth>Search “quinoa”</Button>
            <Button variant="quiet" fullWidth>Enter the values myself</Button>
          </>
        }
      />
    </Frame>
  ),
};

/** Barcode not found falls back to the same state with the scanned code
 *  carried through, so the user is not left holding a number with nowhere to
 *  put it. */
export const BarcodeNotFound = {
  render: () => (
    <Frame>
      <EmptyState
        title="That barcode isn’t in the database"
        body="5 060 123 456 789 — scanned just now. Own-brand and local products are often missing."
        actions={
          <>
            <Button variant="secondary" fullWidth>Search by name instead</Button>
            <Button variant="quiet" fullWidth>Enter the values myself</Button>
          </>
        }
      />
    </Frame>
  ),
};

/** Recipe Discovery, no matching recipes — the most important empty state in
 *  the app. It names *which* constraint is binding and offers to relax that
 *  one, rather than telling the user to start again.
 *
 *  The insight is a berry rule, not a filled card: a container here would be
 *  one more box in a system that separates by space. The lead names the
 *  binding constraint; the detail carries its consequence and previews what
 *  relaxing it would return. */
export const NoMatchingRecipes = {
  render: () => (
    <Frame>
      <EmptyState
        title="Nothing matches all four filters"
        body="Your search for “lentil” has 18 recipes. The calorie ceiling is what removes them."
        constraint={{
          lead: 'Under 400 kcal is what empties the list.',
          detail: 'It excludes 16 of the 18 recipes. Raising it to 500 brings back 11.',
        }}
        actions={
          <>
            <Button fullWidth>Raise to 500 kcal</Button>
            <Button variant="secondary" fullWidth>Clear all filters</Button>
          </>
        }
      />
    </Frame>
  ),
};

/** The same pattern with a different constraint binding. The lead always
 *  names one filter, never "your filters" in general. */
export const NoMatchingRecipesExclusion = {
  name: 'No Matching Recipes (exclusion binding)',
  render: () => (
    <Frame>
      <EmptyState
        title="No recipes match “No dairy”"
        body="Everything else you’ve set still has 9 recipes behind it."
        constraint={{
          lead: 'Excluding dairy removes all 9.',
          detail: 'Seven of them use only feta or yoghurt as a topping.',
        }}
        actions={
          <>
            <Button fullWidth>Drop the dairy exclusion</Button>
            <Button variant="secondary" fullWidth>Clear all filters</Button>
          </>
        }
      />
    </Frame>
  ),
};

/** The unrecoverable case — the database could not be reached at all. Still
 *  calm, still offers the one action that helps. */
export const Error = {
  render: () => (
    <Frame>
      <EmptyState
        title="We couldn’t reach the food database"
        body="Nothing is wrong with what you typed. This is usually brief."
        actions={<Button fullWidth>Try again</Button>}
      />
    </Frame>
  ),
};
