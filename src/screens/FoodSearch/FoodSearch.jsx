import { useState } from 'react';
import './FoodSearch.css';
import {
  SearchField, FoodResultRow, FoodResultList, EmptyState, Button,
  Banner, SkeletonResultList, BottomSheet, InputField, TabBar, NavBar,
  IconBarcode,
} from '../../index';
import { Screen } from '../Screen/Screen';
import { img } from '../../lib/sampleData';
import {
  results as defaultResults, suggestions as defaultSuggestions,
  broadenedQuery, relatedQuery, scannedBarcode,
} from '../flow1Data';

/**
 * SCREEN 1 — Food Search.
 *
 * "Let the user find a product or dish by name — or scan a barcode — so the
 * app can identify it." (SCREENS.md)
 *
 * One screen, several bodies. SCREENS.md is explicit that a separate "search
 * results screen" would be this screen with a different body, so it is not one
 * — the search field and the tab bar are constant and only the body changes.
 *
 * Navigation: this is a root screen, so it carries the TabBar and no back
 * control. Tapping a result is a drill-down to Nutrition Result, which drops
 * the tab bar for a back control instead.
 *
 * `state` picks the body:
 *   first-run          the default state of the default tab
 *   suggestions        completions under the field, mid-query
 *   results            the committed query's matches
 *   loading            skeleton rows in the shape of the results
 *   no-results         the recovery state: broaden, relate, or enter by hand
 *   barcode-not-found  no-results with the scanned code in the field
 *   camera-denied      the inline permission prompt
 *   offline            no connection; manual entry still works
 *   error              the search itself failed, over the last good results
 */
export const FoodSearch = ({
  state: initialState = 'first-run',
  query: initialQuery = '',
  scanning: initialScanning = false,
  manualEntry: initialManualEntry = false,
  manualEntryDraft,
  results = defaultResults,
  suggestions = defaultSuggestions,
  onSelectResult,
}) => {
  const [state, setState] = useState(initialState);
  const [query, setQuery] = useState(initialQuery);
  const [scanning, setScanning] = useState(initialScanning);
  const [manualEntry, setManualEntry] = useState(initialManualEntry);

  const onChange = (value) => {
    setQuery(value);
    setState(value ? 'suggestions' : 'first-run');
  };

  const clear = () => { setQuery(''); setState('first-run'); };

  const pick = (item) => onSelectResult?.(item);

  const list = (rows, label) => (
    <FoodResultList label={label}>
      {rows.map((row) => (
        <FoodResultRow
          key={row.id}
          name={row.name}
          source={row.source}
          kcal={row.kcal}
          image={row.image}
          focal={row.focal}
          onClick={() => pick(row)}
        />
      ))}
    </FoodResultList>
  );

  /* The one action that writes data rather than looking it up. It is offered
     from every dead end: no results, barcode not found, and offline. */
  const manualEntryAction = (variant = 'primary') => (
    <Button variant={variant} fullWidth onClick={() => setManualEntry(true)}>
      Enter the values myself
    </Button>
  );

  /**
   * The recovery composition, shared by every state that has no list to show.
   *
   * The explanatory copy stays at the top and the recovery action is anchored
   * at the bottom of the viewport, so first run, no results, barcode not
   * found, camera off and offline all share one vertical structure. Before
   * this they left 294–402px of dead space that varied with copy length.
   *
   * `EmptyState` supplies the media, the title and the body; the screen places
   * the actions, because only the screen knows where the bottom of the
   * viewport is. `actions` stays an optional prop of the component.
   */
  const recovery = (copy, actions) => (
    <div className="screen-recovery">
      {copy}
      <div className="screen-recovery__actions">{actions}</div>
    </div>
  );

  const body = () => {
    switch (state) {
      /* ------------------------------------------------ first run (dedicated)
         Structurally different from every other state: no result list at all.
         It has three jobs — make the field obvious, offer the barcode as an
         alternative, and set expectations about accuracy — and it does the
         third in one quiet line rather than an onboarding wall. */
      case 'first-run':
        return recovery(
          <>
            <EmptyState
              image={img('citrus-grain-bowl')}
              focal={{ x: 58, y: 52, scale: 1.18 }}
              title="What are you eating?"
              body="Search for a product or a dish by name. If it came in a pack, the barcode is quicker."
            />
            <p className="screen-note fs-expectation">
              Figures come from a verified food database. The portion you set is the
              largest source of variation — you can change it after any result.
            </p>
          </>,
          <Button variant="secondary" fullWidth iconBefore={<IconBarcode size={20} />} onClick={() => setScanning(true)}>
            Scan a barcode
          </Button>,
        );

      /* ----------------------------------------------- suggestions (variation)
         Completions under the field. The same list component as the committed
         results, with a heading that says the query is not finished — the two
         are one body with two headings, not two patterns. */
      case 'suggestions':
        return (
          <>
            <p className="screen-list-head">Suggestions</p>
            {list(suggestions, 'Suggestions')}
          </>
        );

      /* --------------------------------------------------- results (variation) */
      case 'results':
        return (
          <>
            <p className="screen-list-head">
              {results.length} results for <span className="fs-quoted">{query}</span>
            </p>
            {list(results, 'Search results')}
          </>
        );

      /* --------------------------------------------------- loading (variation)
         Skeleton rows occupying the same boxes as the results that replace
         them, so nothing reflows on arrival. */
      case 'loading':
        return (
          <>
            <p className="screen-list-head">Searching…</p>
            <SkeletonResultList rows={5} />
          </>
        );

      /* ----------------------------------------------- no results (dedicated)
         "Trust is lost here if it's a shrug." Three recovery paths in
         SCREENS.md's own order: broaden the query, try a related term, enter
         the values by hand. The third is the one that always produces an
         answer, so it is the surface's single berry action. */
      case 'no-results':
        return recovery(
          <>
            <EmptyState
              title={<>No matches for <span className="fs-quoted">{query}</span></>}
              body="That reads like a brand and a pack size. A shorter search usually finds the food itself."
            />
            {/* The two alternative searches are queries, not peers of the
                fallback that always produces an answer. They step down to the
                44px auto-width control and sit with the copy that explains
                them; the berry action stays anchored at the bottom. */}
            <div className="fs-alternatives">
              <p className="screen-note">Try instead</p>
              <div className="fs-alternatives__row">
                <Button variant="secondary" size="small" onClick={() => { setQuery(broadenedQuery); setState('results'); }}>
                  “{broadenedQuery}”
                </Button>
                <Button variant="secondary" size="small" onClick={() => { setQuery(relatedQuery); setState('results'); }}>
                  “{relatedQuery}”
                </Button>
              </div>
            </div>
          </>,
          manualEntryAction(),
        );

      /* ------------------------------------------ barcode not found (variation)
         SCREENS.md folds this into no results, with the scanned code pre-filled
         in the field. Only the copy changes: a barcode cannot be broadened, so
         the recovery is a name search or manual entry. */
      case 'barcode-not-found':
        return recovery(
          <EmptyState
            title="No product with that barcode"
            body="The code scanned cleanly — the database just has no entry for it yet. That is common for own-brand and local products."
          />,
          <>
            <Button variant="secondary" fullWidth onClick={clear}>Search by name instead</Button>
            {manualEntryAction()}
          </>,
        );

      /* ----------------------------------------- camera permission (variation)
         The standard inline prompt. It never strands the user: the name search
         above it still works, and the prompt says so. */
      case 'camera-denied':
        return recovery(
          <EmptyState
            title="Camera access is off"
            body="Scanning needs the camera. You can turn it on in Settings, or carry on searching by name."
          />,
          <>
            <Button fullWidth onClick={() => {}}>Open Settings</Button>
            <Button variant="secondary" fullWidth onClick={clear}>Search by name instead</Button>
          </>,
        );

      /* ---------------------------------------------------- offline (variation)
         The banner states the condition; the body says what still works.
         Manual entry needs no connection, which makes it the real recovery
         here rather than a consolation. */
      case 'offline':
        return recovery(
          <EmptyState
            title="Search needs a connection"
            body="Results come from the food database. You can still enter a food by hand, and it will be waiting when you are back online."
          />,
          manualEntryAction(),
        );

      /* ------------------------------------------------------ error (variation)
         The request failed but the last good results are still on screen. The
         banner is app-wide and does not block them: nothing was lost, and
         retry is one tap. */
      case 'error':
        return (
          <>
            <p className="screen-list-head">
              {results.length} results for <span className="fs-quoted">{query}</span>
            </p>
            {list(results, 'Search results')}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Screen
      label="Food Search"
      header={
        <>
          <SearchField
            value={query}
            onChange={onChange}
            onClear={clear}
            onScan={() => setScanning(true)}
            loading={state === 'loading'}
            placeholder="Search foods and products"
          />
          {state === 'offline' && (
            <div className="fs-banner">
              {/* No body line: the empty state below already explains what
                  still works, and the banner's own copy has to stay to one
                  line at 390px. */}
              <Banner
                tone="offline"
                title="You are offline"
                actionLabel="Retry"
                onAction={() => setState('first-run')}
              />
            </div>
          )}
          {state === 'error' && (
            <div className="fs-banner">
              <Banner
                tone="error"
                title="Search did not complete"
                body="Showing your last results."
                actionLabel="Retry"
                onAction={() => setState('loading')}
              />
            </div>
          )}
        </>
      }
      footer={
        /* Root navigation. Recipes is the second half of the product and is
           not built in this stage, so the tab is present and inert rather
           than pretending to lead somewhere. */
        <TabBar value="calculate" onChange={() => {}} />
      }
      overlay={
        <>
          {scanning && (
            <BarcodeScanner
              onClose={() => setScanning(false)}
              onNotFound={() => { setScanning(false); setQuery(scannedBarcode); setState('barcode-not-found'); }}
            />
          )}
          <ManualEntrySheet open={manualEntry} draft={manualEntryDraft} onClose={() => setManualEntry(false)} />
        </>
      }
    >
      {body()}
    </Screen>
  );
};

/**
 * The barcode scanning overlay — a camera view over the same screen, not a
 * screen of its own. SCREENS.md: "it is an input shortcut, not a flow."
 *
 * The chrome above and below the viewfinder is the app's own surface, so every
 * control and every word sits on a ground whose contrast is already known.
 * Nothing is written over the camera view, and nothing in it is food.
 */
const BarcodeScanner = ({ onClose, onNotFound }) => (
  <div className="fs-scanner" role="dialog" aria-modal="true" aria-label="Scan a barcode">
    <div className="fs-scanner__bar">
      <NavBar onBack={onClose} backLabel="Close the scanner" title="Scan a barcode" />
    </div>

    <div className="fs-scanner__view">
      {/* A neutral camera field, and the design system's own barcode glyph as
          the targeting cue. There is deliberately no food photograph here:
          a dish inside a reticle reads as "point the camera at food and we
          will identify it", and SCREENS.md excludes photo recognition in the
          first line of its scope table. */}
      <span className="fs-scanner__reticle" aria-hidden="true">
        <IconBarcode size={104} strokeWidth={1.2} />
      </span>
    </div>

    <div className="fs-scanner__foot">
      <p className="screen-note">Hold the barcode inside the frame. It scans on its own — there is nothing to press.</p>
      <Button variant="secondary" fullWidth onClick={onNotFound}>Enter the barcode by hand</Button>
    </div>
  </div>
);

/**
 * Manual entry — the third recovery path, and the only surface in the product
 * that writes data rather than reading it.
 *
 * A sheet, not a screen: typing what the database lacks is a decision inside
 * the US1 task, exactly like setting a portion. The set is the smallest that
 * produces an answer — name, calories, and the three macros. Calories is
 * required because it is the answer; a macro left blank becomes "Not
 * available" on Nutrition Result, never a zero.
 */
const ManualEntrySheet = ({ open, onClose, draft }) => {
  const [values, setValues] = useState(draft ?? { name: '', kcal: '', protein: '', carbs: '', fat: '' });
  const set = (key) => (value) => setValues((v) => ({ ...v, [key]: value }));

  return (
    <BottomSheet
      contained
      open={open}
      onClose={onClose}
      title="Enter the values yourself"
      footer={<Button fullWidth disabled={!values.name || !values.kcal} onClick={onClose}>Use these values</Button>}
    >
      <div className="fs-manual">
        <InputField id="fs-manual-name" label="Food name" value={values.name} onChange={set('name')} placeholder="What is it?" />
        <InputField
          id="fs-manual-kcal"
          label="Calories"
          value={values.kcal}
          onChange={set('kcal')}
          inputMode="decimal"
          unit="kcal"
          unitLabel="kilocalories"
          hint="Per the portion you are entering, not per 100 g."
        />
        <InputField id="fs-manual-protein" label="Protein" value={values.protein} onChange={set('protein')} inputMode="decimal" unit="g" unitLabel="grams" optional />
        <InputField id="fs-manual-carbs" label="Carbohydrate" value={values.carbs} onChange={set('carbs')} inputMode="decimal" unit="g" unitLabel="grams" optional />
        <InputField id="fs-manual-fat" label="Fat" value={values.fat} onChange={set('fat')} inputMode="decimal" unit="g" unitLabel="grams" optional />
        <p className="screen-note">
          A macro left blank stays blank. It is shown as “Not available”, never as a zero.
        </p>
      </div>
    </BottomSheet>
  );
};
