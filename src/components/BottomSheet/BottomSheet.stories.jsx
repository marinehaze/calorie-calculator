import { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { Button } from '../Button/Button';
import { Stepper } from '../Stepper/Stepper';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { FilterChip, FilterChipGroup } from '../FilterChip/FilterChip';
import { FoodResultRow, FoodResultList } from '../FoodResultRow/FoodResultRow';
import { HeroCalories } from '../HeroCalories/HeroCalories';
import { InputField } from '../InputField/InputField';
import { searchResults } from '../../lib/sampleData';

export default {
  title: 'Feedback & States/Bottom Sheet',
  component: BottomSheet,
};

/* A 390px stage, so the sheet can be seen where it actually appears. */
const Stage = ({ children, trigger }) => (
  <div style={{
    position: 'relative',
    width: 390,
    height: 560,
    background: 'var(--ds-canvas)',
    borderRadius: 'var(--ds-radius-lg)',
    boxShadow: '0 0 0 1px rgba(28,27,25,.05)',
    overflow: 'hidden',
    padding: 24,
    margin: '0 auto',
  }}>
    {trigger}
    {children}
  </div>
);

/** All three sheets in SCREENS.md are this component: portion, item swap and
 *  filters. Escape and a scrim tap both close; focus is trapped while open and
 *  returns to whatever opened it.
 *
 *  The portion sheet answers one question and shows one consequence:
 *
 *    How much?  ->  unit  ->  amount  ->  what it comes to
 *
 *  The unit switch is the text SegmentedControl, because here it is only a
 *  mode — the amount stepper below it is the interaction. The stepper is bare,
 *  so the calorie figure stays the strongest value on the surface. Per-100g
 *  data is deliberately absent: it lives on Nutrition Result and adds nothing
 *  to this task. */
const PortionSheetSurface = ({ initialUnit }) => {
  {
    const [open, setOpen] = useState(true);
    const [unit, setUnit] = useState(initialUnit);
    const [grams, setGrams] = useState(340);
    const [portions, setPortions] = useState(1);

    const gramsPerPortion = 340;
    const kcalPer100 = 150.6;
    const totalGrams = unit === 'g' ? grams : portions * gramsPerPortion;
    const kcal = Math.round((totalGrams * kcalPer100) / 100);

    return (
      <Stage trigger={<Button variant="secondary" fullWidth onClick={() => setOpen(true)}>Change portion</Button>}>
        <BottomSheet
          contained
          open={open}
          onClose={() => setOpen(false)}
          title="Portion"
          footerDivider={false}
          footer={<Button fullWidth onClick={() => setOpen(false)}>Done</Button>}
        >
          <p style={{ font: '400 16px/1.4 var(--ds-font-ui)', color: 'var(--ds-ink-2)', margin: 0 }}>
            How much?
          </p>

          {/* The control is inline-flex, so the surface centres it. */}
          <div style={{ marginTop: 'var(--ds-space-3)', display: 'flex', justifyContent: 'center' }}>
            <SegmentedControl
              variant="text"
              label="Unit"
              value={unit}
              onChange={setUnit}
              options={[{ value: 'g', label: 'Grams' }, { value: 'portion', label: 'Portions' }]}
            />
          </div>

          <div style={{ marginTop: 'var(--ds-space-3)' }}>
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

          {/* Only in Portions mode, and attached to the amount it explains. */}
          {unit === 'portion' && (
            <p style={{
              margin: 'var(--ds-space-1) 0 0', textAlign: 'center',
              font: '400 14px/1.4 var(--ds-font-ui)', color: 'var(--ds-ink-2)',
            }}>
              1 portion = {gramsPerPortion} g
            </p>
          )}

          <hr style={{ border: 0, borderTop: '1px solid var(--ds-line)', margin: 'var(--ds-space-3) 0 0' }} />

          <div style={{ marginTop: 'var(--ds-space-3)', textAlign: 'center' }}>
            <HeroCalories value={kcal} size="sm" align="center" />
            <p style={{
              margin: 'var(--ds-space-1) 0 var(--ds-space-4)',
              font: '400 15px/1.4 var(--ds-font-ui)', color: 'var(--ds-ink-2)',
            }}>
              for this amount
            </p>
          </div>
        </BottomSheet>
      </Stage>
    );
  }
};

/** A · Grams selected — the default. */
export const PortionSheet = {
  name: 'Portion Sheet (grams)',
  render: () => <PortionSheetSurface initialUnit="g" />,
};

/** B · Portions selected. The equivalence line appears only here, directly
 *  under the amount it explains. */
export const PortionSheetPortions = {
  name: 'Portion Sheet (portions)',
  render: () => <PortionSheetSurface initialUnit="portion" />,
};

/** The item-swap sheet reuses Food Search's result list, exactly as SCREENS.md
 *  specifies. No new pattern was invented for it. */
export const ItemSwapSheet = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <Stage trigger={<Button variant="secondary" fullWidth onClick={() => setOpen(true)}>Not the right match?</Button>}>
        <BottomSheet contained open={open} onClose={() => setOpen(false)} title="Choose the right match">
          <FoodResultList label="Alternative matches">
            <FoodResultRow name="Red lentils, boiled" source="Generic · per 150 g" kcal={174} image={searchResults[2].image} onClick={() => setOpen(false)} />
            <FoodResultRow name="Puy lentils, cooked" source="Merchant Gourmet · per 125 g" kcal={168} image={searchResults[0].image} onClick={() => setOpen(false)} />
            <FoodResultRow name="Green lentils, canned, drained" source="Bonduelle · per 130 g" kcal={139} image={searchResults[2].image} onClick={() => setOpen(false)} />
          </FoodResultList>
        </BottomSheet>
      </Stage>
    );
  },
};

/** The filter sheet. SCREENS.md calls it the most important non-screen surface
 *  in the app: it carries the entire meaning of "suitable for me", and it is
 *  the surface that replaced a dedicated preferences screen. The footer action
 *  stays put while the body scrolls, so Apply is never below the fold. */
export const FilterSheet = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [diet, setDiet] = useState(['Vegan']);
    const [exclude, setExclude] = useState(['Nuts']);
    const [kcal, setKcal] = useState('500');
    const [time, setTime] = useState('30');
    const toggle = (set) => (v) => set((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
    const Group = ({ label, children }) => (
      <div style={{ marginBottom: 24 }}>
        <p style={{ font: '400 15px var(--ds-font-ui)', color: 'var(--ds-ink-2)', margin: '0 0 8px' }}>{label}</p>
        {children}
      </div>
    );
    return (
      <Stage trigger={<Button variant="secondary" fullWidth onClick={() => setOpen(true)}>Filters</Button>}>
        <BottomSheet
          contained
          open={open}
          onClose={() => setOpen(false)}
          title="Suitable for me"
          footer={
            <>
              <Button fullWidth onClick={() => setOpen(false)}>Show 11 recipes</Button>
              <Button variant="quiet" fullWidth onClick={() => { setDiet([]); setExclude([]); }}>Clear all</Button>
            </>
          }
        >
          <Group label="Diet">
            <FilterChipGroup label="Diet">
              {['Vegan', 'Vegetarian', 'Pescatarian', 'Gluten free'].map((v) => (
                <FilterChip key={v} selected={diet.includes(v)} onClick={() => toggle(setDiet)(v)}>{v}</FilterChip>
              ))}
            </FilterChipGroup>
          </Group>
          <Group label="Exclude">
            <FilterChipGroup label="Exclude">
              {['Nuts', 'Dairy', 'Egg', 'Soy', 'Sesame'].map((v) => (
                <FilterChip key={v} selected={exclude.includes(v)} onClick={() => toggle(setExclude)(v)}>{v}</FilterChip>
              ))}
            </FilterChipGroup>
          </Group>
          <Group label="Calories per serving">
            <SegmentedControl
              label="Calories per serving"
              value={kcal}
              onChange={setKcal}
              options={[{ value: '400', label: '< 400' }, { value: '500', label: '< 500' }, { value: 'any', label: 'Any' }]}
            />
          </Group>
          <Group label="Time">
            <SegmentedControl
              label="Time"
              value={time}
              onChange={setTime}
              options={[{ value: '15', label: '< 15 min' }, { value: '30', label: '< 30 min' }, { value: 'any', label: 'Any' }]}
            />
          </Group>
        </BottomSheet>
      </Stage>
    );
  },
};

/** Manual entry — the third recovery path SCREENS.md asks of the no-results
 *  state, reached from "Enter the values myself" there and on barcode not
 *  found. It is a sheet, not a screen: typing what the database is missing is
 *  a decision inside the US1 task, exactly like setting a portion.
 *
 *  Kept to the smallest set that produces an answer. Calories is required
 *  because it is the answer; the macros are optional, and leaving one blank
 *  produces "Not available" rather than a zero. */
export const ManualEntrySheet = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [v, setV] = useState({ name: 'Aunt\u2019s lentil soup', kcal: '268', protein: '14', carbs: '', fat: '' });
    const set = (k) => (x) => setV((s) => ({ ...s, [k]: x }));
    return (
      <Stage trigger={<Button variant="quiet" fullWidth onClick={() => setOpen(true)}>Enter the values myself</Button>}>
        <BottomSheet
          contained
          open={open}
          onClose={() => setOpen(false)}
          title="Enter the values yourself"
          footer={<Button fullWidth onClick={() => setOpen(false)}>Use these values</Button>}
        >
          <div style={{ display: 'grid', gap: 20 }}>
            <InputField id="ms-name" label="Food name" value={v.name} onChange={set('name')} placeholder="What is it?" />
            <InputField
              id="ms-kcal"
              label="Calories"
              value={v.kcal}
              onChange={set('kcal')}
              inputMode="decimal"
              unit="kcal"
              unitLabel="kilocalories"
              hint="Per the portion you are entering, not per 100 g."
            />
            <InputField id="ms-protein" label="Protein" value={v.protein} onChange={set('protein')} inputMode="decimal" unit="g" unitLabel="grams" optional />
            <InputField id="ms-carbs" label="Carbohydrate" value={v.carbs} onChange={set('carbs')} inputMode="decimal" unit="g" unitLabel="grams" optional />
            <InputField id="ms-fat" label="Fat" value={v.fat} onChange={set('fat')} inputMode="decimal" unit="g" unitLabel="grams" optional />
          </div>
        </BottomSheet>
      </Stage>
    );
  },
};
