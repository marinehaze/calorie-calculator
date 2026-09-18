import { FoodSearch } from './FoodSearch';
import { query, deadQuery, scannedBarcode } from '../flow1Data';

export default {
  title: 'Screens/Food Search',
  component: FoodSearch,
  /* `deviceFrame` is review-only presentation: a stage behind the 390px
     frame, a drop shadow, and a simulated bottom safe area with a home
     indicator. A desktop browser reports env(safe-area-inset-bottom) as 0,
     so without it the tab bar and the pinned action band cannot be judged
     at the size they take on a handset. See .storybook/preview.css. */
  parameters: { layout: 'fullscreen', deviceFrame: true, backgrounds: { value: 'stage' } },
};

/** ◆ Dedicated — first run.
 *
 *  The default state of the app's default tab, and structurally different from
 *  every other state: there is no result list at all. It has three jobs and
 *  does each once — make the field obvious, offer the barcode as the quicker
 *  route for a packaged product, and set expectations about accuracy. The
 *  expectation is a footnote rather than an onboarding wall. */
export const FirstRun = {
  name: 'First run (empty) ◆',
  render: () => <FoodSearch state="first-run" />,
};

/** · Typing. Completions under the field, using the same result list as the
 *  committed query: SCREENS.md treats the populated bodies as one pattern with
 *  different content, not as different screens. */
export const Suggestions = {
  name: 'Typing · suggestions',
  render: () => <FoodSearch state="suggestions" query="lent" />,
};

/** · Results. The last row is a real database entry with no calorie figure —
 *  it says "No data" rather than showing a zero, which would be a claim about
 *  the food. */
export const Results = {
  name: 'Results',
  render: () => <FoodSearch state="results" query={query} />,
};

/** · Loading. Skeleton rows in the same boxes the results will occupy, so
 *  nothing reflows when they arrive. The field carries its own spinner, since
 *  it is the control the wait belongs to. */
export const Loading = {
  name: 'Loading · skeleton',
  render: () => <FoodSearch state="loading" query={query} />,
};

/** ◆ Dedicated — no results.
 *
 *  The app's key recovery path. Three ways forward in SCREENS.md's order:
 *  broaden the query, try a related term, enter the values by hand. Manual
 *  entry is the only one that always produces an answer, so it takes the
 *  surface's single berry action. */
export const NoResults = {
  name: 'No results ◆',
  render: () => <FoodSearch state="no-results" query={deadQuery} />,
};

/** · Manual entry, opened from the no-results state. A sheet, not a screen:
 *  typing what the database lacks is a decision inside the task. Calories is
 *  required because it is the answer; the macros say "Optional" in words, and
 *  a blank one becomes "Not available" on Screen 2, never a zero. */
export const ManualEntry = {
  name: 'No results · manual entry sheet',
  render: () => (
    <FoodSearch
      state="no-results"
      query={deadQuery}
      manualEntry
      manualEntryDraft={{ name: 'Creamy lentil dahl', kcal: '395', protein: '16', carbs: '', fat: '' }}
    />
  ),
};

/** · The barcode scanning overlay. A camera view over the same screen — an
 *  input shortcut, not a flow. Every control and every word sits on the app's
 *  own surface above or below the viewfinder; nothing is written over the
 *  camera image. */
export const BarcodeScanning = {
  name: 'Barcode · scanning',
  render: () => <FoodSearch state="first-run" scanning />,
};

/** · Barcode not found. SCREENS.md folds this into the no-results state with
 *  the scanned code pre-filled. A barcode cannot be broadened, so the two
 *  recoveries are a name search and manual entry. */
export const BarcodeNotFound = {
  name: 'Barcode · not found',
  render: () => <FoodSearch state="barcode-not-found" query={scannedBarcode} />,
};

/** · Camera permission denied. The standard inline prompt. It never strands
 *  the user: the search field above it still works, and the copy says so. */
export const CameraDenied = {
  name: 'Barcode · camera access off',
  render: () => <FoodSearch state="camera-denied" />,
};

/** · Offline. The shared banner states the condition; the body says what still
 *  works. Manual entry needs no connection, which makes it a real recovery
 *  rather than a consolation. role="status", so a standing notice does not
 *  interrupt. */
export const Offline = {
  name: 'Offline',
  render: () => <FoodSearch state="offline" />,
};

/** · Search error. The request failed and the last good results are still on
 *  screen — the banner is app-wide and does not block them. role="alert",
 *  because this has just happened. */
export const SearchError = {
  name: 'Error · search did not complete',
  render: () => <FoodSearch state="error" query={query} />,
};
