import { HeroCalories } from './HeroCalories';
import { Frame, Stack, Note } from '../../lib/Frame';

export default {
  title: 'Nutrition/Hero Calorie Value',
  component: HeroCalories,
};

/** Plus Jakarta Sans 500 — the approved hero weight. 300 is not loaded.
 *  The unit never competes with the value it belongs to. */
export const Sizes = {
  render: () => (
    <Frame>
      <Stack gap={40}>
        <div><Note>lg · 76px — Nutrition Result</Note><HeroCalories value={512} /></div>
        <div><Note>md · 56px — Recipe Detail</Note><HeroCalories value={438} unit="kcal per serving" size="md" /></div>
        <div><Note>sm · 40px — inside a sheet</Note><HeroCalories value={97} size="sm" /></div>
      </Stack>
    </Frame>
  ),
};

/** Four-digit totals are common for a multi-item dish and must not overflow
 *  the 342px content column. Figures are tabular, so digits do not jitter as
 *  the number changes. */
export const NumberLengths = {
  render: () => (
    <Frame>
      <Stack gap={32}>
        <HeroCalories value={97} />
        <HeroCalories value={512} />
        <HeroCalories value={1284} />
      </Stack>
    </Frame>
  ),
};

/** Recalculating after a portion edit: the figure dims in place. SCREENS.md
 *  requires numbers to transition, never a blocking spinner. */
export const Recalculating = {
  render: () => (
    <Frame>
      <Note>pending</Note>
      <HeroCalories value={604} pending />
    </Frame>
  ),
};

/** A database entry with no calorie figure says so. It is never a zero, which
 *  would read as a fact about the food. */
export const Unavailable = {
  render: () => (
    <Frame>
      <HeroCalories value={null} />
    </Frame>
  ),
};
