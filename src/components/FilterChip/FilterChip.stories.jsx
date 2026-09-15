import { useState } from 'react';
import { FilterChip, FilterChipRow, FilterChipGroup } from './FilterChip';
import { Frame, Stack, Note } from '../../lib/Frame';

export default {
  title: 'Input & Navigation/Filter Chip',
  component: FilterChip,
};

/** Inside the filter sheet: chips toggle. Selected takes the berry tint, a
 *  full berry border, berry text at medium weight and a check — four signals,
 *  only one of which is a hue, so selection survives greyscale. */
export const Selectable = {
  render: () => {
    const [on, setOn] = useState(['Vegan', 'Under 30 min']);
    const toggle = (v) => setOn((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
    return (
      <Frame>
        <Stack gap={24}>
          <div>
            <Note>Diet</Note>
            <FilterChipGroup label="Diet">
              {['Vegan', 'Vegetarian', 'Pescatarian', 'Gluten free', 'Dairy free'].map((v) => (
                <FilterChip key={v} selected={on.includes(v)} onClick={() => toggle(v)}>{v}</FilterChip>
              ))}
            </FilterChipGroup>
          </div>
          <div>
            <Note>Time — with one option unavailable for the current query</Note>
            <FilterChipGroup label="Time">
              <FilterChip selected={on.includes('Under 15 min')} onClick={() => toggle('Under 15 min')}>Under 15 min</FilterChip>
              <FilterChip selected={on.includes('Under 30 min')} onClick={() => toggle('Under 30 min')}>Under 30 min</FilterChip>
              <FilterChip disabled>Under 10 min</FilterChip>
            </FilterChipGroup>
          </div>
        </Stack>
      </Frame>
    );
  },
};

/** Selected against unselected, at the size they are actually used — and the
 *  same pair in greyscale, because a selection signal that needs hue is not a
 *  selection signal. Border strength, weight and the check all survive it. */
export const SelectedVersusUnselected = {
  render: () => {
    const chips = (
      <>
        <FilterChip selected>Vegan</FilterChip>
        <FilterChip>Vegetarian</FilterChip>
        <FilterChip selected>Gluten free</FilterChip>
        <FilterChip>Dairy free</FilterChip>
      </>
    );
    return (
      <Frame>
        <Stack gap={24}>
          <div>
            <Note>In colour — berry tint and border, medium weight, a check</Note>
            <FilterChipGroup label="Diet">{chips}</FilterChipGroup>
          </div>
          <div>
            <Note>Greyscale — border, weight and check still read</Note>
            <div style={{ filter: 'grayscale(1)' }}>
              <FilterChipGroup label="Diet, greyscale">{chips}</FilterChipGroup>
            </div>
          </div>
        </Stack>
      </Frame>
    );
  },
};

/** Under the search field: the filters currently in force, i.e. what "suitable
 *  for me" means right now. The whole chip removes, so there is one 44px
 *  target rather than a small × nested inside a larger control.
 *
 *  Same berry family as the selected toggle, one step down: a 70% berry border
 *  (3.90 : 1 on canvas) and regular weight. Four of these at full strength
 *  would stop being one controlled accent.
 *
 *  The × stays. Now that applied chips read as berry, it is the only mark
 *  saying a tap removes rather than toggles — and dropping it saves no vertical
 *  space, since four chips wrap to two lines either way. */
export const ActiveFilters = {
  render: () => {
    const [on, setOn] = useState(['Vegan', '<400 kcal', 'No nuts', '<30 min']);
    return (
      <Frame>
        <Note>Wraps onto a second line — nothing is ever clipped at the screen edge</Note>
        <FilterChipRow>
          {on.map((v) => (
            <FilterChip key={v} mode="remove" onClick={() => setOn((s) => s.filter((x) => x !== v))}>{v}</FilterChip>
          ))}
        </FilterChipRow>
      </Frame>
    );
  },
};
