import { useState } from 'react';
import './NutritionResult.css';
import {
  NavBar, FoodImage, HeroCalories, PortionPair, MacroGroup, MacroEnergySplit, SegmentedControl,
  IngredientRow, IngredientList, Button, BottomSheet, Stepper, FoodResultRow,
  FoodResultList, Banner, Skeleton,
} from '../../index';
import { Screen } from '../Screen/Screen';
import { puyLentils, puyAlternatives, itemAlternatives } from '../flow1Data';

/**
 * SCREEN 2 — Nutrition Result.
 *
 * "Show what was identified, let the user correct portions, and give the
 * calorie and macro answer for one item or a whole dish." (SCREENS.md)
 *
 * One item or many, one screen. A product and a homemade dish are the same
 * object with a different item count, so `dish.items` — not a different
 * component — is what separates the two dedicated layouts.
 *
 * Navigation: a drill-down. Back control, no tab bar, and no title in the nav
 * bar, because the dish name is already the largest thing on the screen.
 *
 * Composition follows the approved stylescape's own Nutrition Result
 * fragments: the bleed crop enters from the right and is balanced by the name
 * and the hero figure in the open left column (fragment 01), and the
 * "Nutrition" section head carries the Portion / Per 100 g switch above the
 * macros and the item list (fragment 02). The nutrition hierarchy is the
 * system's and is unchanged —
 *
 *     calories → portion / per 100 g → protein / carbs / fat → items
 *
 * — with nothing inserted above the calories.
 */
export const NutritionResult = ({
  dish = puyLentils,
  state = 'ready',              // ready | recalculating | loading | error
  sheet: initialSheet = null,   // portion | swap
  sheetItem: initialSheetItem = null,
  /* A drill-down always has a way back. The default keeps the control present
     in a story, where there is no screen behind this one to return to. */
  onBack = () => {},
  onAddItem,
}) => {
  const [basis, setBasis] = useState('portion');
  const [sheet, setSheet] = useState(initialSheet);
  const [item, setItem] = useState(initialSheetItem);

  const per100 = basis === '100g';
  const pending = state === 'recalculating' || state === 'loading';
  const items = dish.items;

  /* The switch changes the basis of every figure below it at once — the hero,
     the macros — while the portion / per-100 g pair stays put. The pair is the
     reference the switch reads against, so it does not move with it.

     When the breakdown failed to load, everything the request would have
     carried goes back to null and says so in words. The calorie figure stays,
     because it came with the tapped search row rather than with this request —
     and nothing here is ever backfilled with a zero. */
  const failed = state === 'error';
  const kcal = per100 ? (failed ? null : dish.kcalPer100) : dish.kcal;
  const macros = failed ? { protein: null, carbs: null, fat: null }
    : per100 ? dish.macrosPer100 : dish.macros;
  const per100Reference = failed ? null : dish.per100;
  const note = failed
    ? 'Only the calorie figure from your search result arrived. The rest is not missing from the database — it did not load.'
    : dish.note;

  const openItemSheet = (row) => { setItem(row); setSheet('portion'); };
  const closeSheet = () => { setSheet(null); setItem(null); };

  return (
    <Screen
      label="Nutrition Result"
      /* The one forward action pins to the bottom band, so it is reachable at
         any content height. Before this the whole action stack was the last
         thing in normal flow and its position depended on how tall the entry
         happened to be — on the error state every action sat below the fold. */
      footer={
        <div className="screen-action-bar">
          <Button variant="quiet" fullWidth onClick={onAddItem}>Add another item</Button>
        </div>
      }
      overlay={
        <>
          <PortionSheet
            open={sheet === 'portion'}
            onClose={closeSheet}
            subject={item ?? dish}
            isDishItem={Boolean(item)}
            onSwap={() => setSheet('swap')}
          />
          <SwapSheet
            open={sheet === 'swap'}
            onClose={closeSheet}
            alternatives={item ? itemAlternatives : puyAlternatives}
          />
        </>
      }
    >
      {/* ------------------------------------------------ identity + the answer
          The brand signature: an asymmetric crop entering from the right edge,
          balanced by the name and the calorie figure holding the open left.
          `.ds-bleed-stage` supplies the full-width positioning context and
          `.ds-bleed-stage__type` caps the type column, which together are what
          keep data off the food. */}
      <div className="ds-bleed-stage nr-stage">
        <FoodImage
          className="nr-stage__crop"
          src={dish.image}
          crop="circle"
          bleed="right"
          focalX={dish.focal?.x}
          focalY={dish.focal?.y}
          scale={dish.focal?.scale}
          alt=""
        />

        <div className="nr-stage__nav">
          <NavBar onBack={onBack} backLabel="Back to search" />
        </div>

        <div className="ds-bleed-stage__type">
          <p className="ds-eyebrow">{dish.eyebrow}</p>
          <h1 className="nr-name">{dish.name}</h1>
          <p className="screen-note nr-source">{dish.source}</p>

          <div className="nr-hero">
            {state === 'loading'
              ? <HeroCalories value={dish.kcal} size="lg" pending />
              : <HeroCalories value={kcal} size="lg" pending={state === 'recalculating'} />}
          </div>
        </div>

        <div className="nr-pair">
          {state === 'loading'
            ? <LoadingPair />
            : <PortionPair portion={dish.portion} per100={per100Reference} />}
        </div>

        {/* Both corrections sit directly under the figures they correct: the
            amount, then the match itself. A single item is the only case that
            has them — inside a dish each row carries its own. */}
        {!items && (
          <div className="screen-actions nr-corrections">
            <Button variant="secondary" fullWidth onClick={() => setSheet('portion')}>Change portion</Button>
            <Button variant="secondary" fullWidth onClick={() => setSheet('swap')}>Not the right match?</Button>
          </div>
        )}
      </div>

      {state === 'error' && (
        <div className="nr-banner">
          <Banner
            tone="error"
            title="The breakdown did not load"
            body="The calorie figure is the one from your search result."
            actionLabel="Retry"
            onAction={() => {}}
          />
        </div>
      )}

      {/* ----------------------------------------------------- nutrition
          The switch sits beside the section title, as the system requires, and
          governs the figures on both sides of it. */}
      <section className="screen-section nr-nutrition" aria-busy={pending || undefined}>
        <div className="nr-nutrition__head">
          <h2 className="nr-section-title">Nutrition</h2>
          <SegmentedControl
            label="Show nutrition per"
            value={basis}
            onChange={setBasis}
            /* Not disabled when the entry has no per-100 g figure. The
               product states missing data in words rather than removing the
               control that would reveal it, and both the hero and the macros
               already know how to say so. */
            disabled={state === 'loading'}
            options={[{ value: 'portion', label: 'Portion' }, { value: '100g', label: 'Per 100 g' }]}
          />
        </div>

        <div className="nr-macros">
          {state === 'loading' ? <LoadingMacros /> : (
            <>
              {/* Where the calories come from, above the exact grams. Renders
                  nothing unless all three macros are known. */}
              <MacroEnergySplit macros={macros} pending={state === 'recalculating'} />
              <MacroGroup macros={macros} pending={state === 'recalculating'} />
            </>
          )}
        </div>
      </section>

      {/* -------------------------------------------------- items (multi-item)
          The dedicated multi-item layout: a row per item with its own amount
          and contribution, under a head that sticks to the top of the scroll
          so the running total stays visible however long the list grows. */}
      {items && state !== 'loading' && (
        <section className="nr-items">
          <div className="nr-items__head">
            <p className="screen-list-head nr-items__label">Items</p>
            <p className="nr-items__total">
              <span className="ds-sr-only">Total {dish.kcal} kcal</span>
              <span aria-hidden="true" className="ds-num">{dish.kcal}</span>
              <span aria-hidden="true" className="nr-items__unit">kcal</span>
            </p>
          </div>
          <IngredientList label="Items in this dish">
            {items.map((row) => (
              <IngredientRow
                key={row.id}
                name={row.name}
                amount={row.amount}
                kcal={row.kcal}
                onClick={() => openItemSheet(row)}
              />
            ))}
          </IngredientList>
        </section>
      )}

      {state !== 'loading' && (
        <p className="screen-note nr-note">
          {note}
          {items ? ' Tap an item to change its amount, swap it, or take it out.' : ''}
        </p>
      )}

    </Screen>
  );
};

/* Progressive fill: the calorie figure arrived with the tapped search result,
   so it is already on screen. Only the figures the row could not carry are
   still loading.
 *
 * The bar heights mirror the real boxes exactly, so the screen does not jump
 * when the rest of the entry lands. Measured against the loaded screen:
 *
 *   portion pair   value 29   gap 5   label 21.8   = 55.8
 *   macro column   value 24   gap 9   label 21.8   = 54.8
 *
 * They are stated here rather than derived because the design system's
 * contract is that a skeleton occupies the same box as the content it
 * replaces, and the only way to hold that is to name the box. */
const PAIR_VALUE_H = 29;
const PAIR_LABEL_H = 21.8;
const MACRO_VALUE_H = 24;
const MACRO_LABEL_H = 21.8;

const LoadingPair = () => (
  <div className="nr-loading-pair" role="status" aria-label="Loading the full breakdown">
    {[0, 1].map((i) => (
      <span className="nr-loading-pair__cell" key={i}>
        <Skeleton width={84} height={PAIR_VALUE_H} />
        <Skeleton width={62} height={PAIR_LABEL_H} style={{ marginTop: 5 }} />
      </span>
    ))}
  </div>
);

const LoadingMacros = () => (
  <div className="nr-loading-macros" role="status" aria-label="Loading macros">
    {[0, 1, 2].map((i) => (
      <span key={i}>
        <Skeleton width="72%" height={MACRO_VALUE_H} />
        <Skeleton width="54%" height={MACRO_LABEL_H} style={{ marginTop: 9 }} />
      </span>
    ))}
  </div>
);

/**
 * The portion sheet. One question, one consequence:
 *
 *   How much?  →  unit  →  amount  →  what it comes to
 *
 * The unit switch is the text variant, because here it is only a mode and the
 * amount stepper below it is what gets touched. The total recalculates live
 * behind the sheet; there is no confirm step and no blocking spinner.
 *
 * Opened for one item of a dish, it also carries that item's other two
 * decisions — swap it, or take it out — because they belong to the same row
 * and a second sheet for each would make a destination out of a decision.
 */
const PortionSheet = ({ open, onClose, subject, isDishItem, onSwap }) => {
  const base = subject?.grams ?? 100;
  const [unit, setUnit] = useState('g');
  const [grams, setGrams] = useState(base);
  const [portions, setPortions] = useState(1);

  const kcalPer100 = subject?.kcal != null && subject?.grams ? (subject.kcal / subject.grams) * 100 : null;
  const totalGrams = unit === 'g' ? grams : portions * base;
  const kcal = kcalPer100 == null ? null : Math.round((totalGrams * kcalPer100) / 100);

  return (
    <BottomSheet
      contained
      open={open}
      onClose={onClose}
      title={isDishItem ? subject.name : 'Portion'}
      footerDivider={false}
      footer={<Button fullWidth onClick={onClose}>Done</Button>}
    >
      <p className="nr-sheet-lead">How much?</p>

      <div className="nr-sheet-switch">
        <SegmentedControl
          variant="text"
          label="Unit"
          value={unit}
          onChange={setUnit}
          options={[{ value: 'g', label: 'Grams' }, { value: 'portion', label: 'Portions' }]}
        />
      </div>

      <div className="nr-sheet-amount">
        {unit === 'g' ? (
          <Stepper variant="bare" label="amount" value={grams} unit="g" step={10} min={10} max={2000} onChange={setGrams} />
        ) : (
          <Stepper
            variant="bare"
            label="amount"
            value={portions}
            unit={portions === 1 ? 'portion' : 'portions'}
            step={1} min={1} max={20}
            onChange={setPortions}
          />
        )}
      </div>

      {unit === 'portion' && <p className="nr-sheet-equiv">1 portion = {base} g</p>}

      <hr className="nr-sheet-rule" />

      <div className="nr-sheet-result">
        <HeroCalories value={kcal} size="sm" align="center" unavailableLabel="No calorie figure for this amount" />
        {kcal != null && <p className="nr-sheet-caption">for this amount</p>}
      </div>

      {isDishItem && (
        <div className="nr-sheet-extra">
          <Button variant="secondary" fullWidth onClick={onSwap}>Choose a different match</Button>
          {/* Not the quiet variant: quiet is berry on a tint, and putting the
              accent on a removal would promote the one action on this sheet
              that takes something away. The system has no destructive
              treatment by decision — nothing in this product turns red. */}
          <Button variant="secondary" fullWidth onClick={onClose}>Take it out of the dish</Button>
        </div>
      )}
    </BottomSheet>
  );
};

/**
 * The item-swap sheet — Screen 1's result list, inside a sheet, exactly as
 * SCREENS.md specifies. The entry the user opened the sheet to reject is not
 * among the alternatives: offering it back is the one thing this surface must
 * not do.
 */
const SwapSheet = ({ open, onClose, alternatives }) => (
  <BottomSheet contained open={open} onClose={onClose} title="Choose the right match">
    <FoodResultList label="Alternative matches">
      {alternatives.map((row) => (
        <FoodResultRow
          key={row.id}
          name={row.name}
          source={row.source}
          kcal={row.kcal}
          image={row.image}
          focal={row.focal}
          onClick={onClose}
        />
      ))}
    </FoodResultList>
  </BottomSheet>
);
