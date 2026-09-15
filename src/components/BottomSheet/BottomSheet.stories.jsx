import { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { Button } from '../Button/Button';
import { Stepper } from '../Stepper/Stepper';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { FilterChip, FilterChipGroup } from '../FilterChip/FilterChip';
import { FoodResultRow, FoodResultList } from '../FoodResultRow/FoodResultRow';
import { HeroCalories } from '../HeroCalories/HeroCalories';
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
 *  returns to whatever opened it. */
export const PortionSheet = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [grams, setGrams] = useState(340);
    const [unit, setUnit] = useState('g');
    const kcal = Math.round(grams * 1.506);
    return (
      <Stage trigger={<Button variant="secondary" fullWidth onClick={() => setOpen(true)}>Change portion</Button>}>
        <BottomSheet contained open={open} onClose={() => setOpen(false)} title="Portion"
          footer={<Button fullWidth onClick={() => setOpen(false)}>Done</Button>}>
          <SegmentedControl
            label="Unit"
            value={unit}
            onChange={setUnit}
            options={[{ value: 'g', label: 'Grams' }, { value: 'portion', label: 'Portions' }]}
          />
          <div style={{ marginTop: 24 }}>
            <Stepper label="Amount" value={grams} unit="g" step={10} min={10} max={2000} onChange={setGrams} />
          </div>
          <div style={{ marginTop: 32 }}>
            {/* The total recalculates live behind the sheet; it is echoed here
                so the user sees the consequence of the control they are using. */}
            <p style={{ font: '400 15px var(--ds-font-ui)', color: 'var(--ds-ink-2)', margin: '0 0 8px' }}>New total</p>
            <HeroCalories value={kcal} size="sm" />
          </div>
        </BottomSheet>
      </Stage>
    );
  },
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
