import { MacroEnergySplit } from './MacroEnergySplit';
import { MacroGroup } from '../MacroGroup/MacroGroup';
import { Frame, Stack, Note } from '../../lib/Frame';

export default {
  title: 'Nutrition/Macro Energy Split',
  component: MacroEnergySplit,
};

/** Shown as it is composed in the product: the split immediately above the
 *  gram grid. Puy lentils, 250 g: 21 g / 44 g / 3.5 g of protein / carbs /
 *  fat is 84 / 176 / 31.5 kcal, so 29% / 60% / 11%. The grams stay exact;
 *  the split says what they add up to. */
export const Complete = {
  render: () => (
    <Frame>
      <Note>Puy lentils, ready to eat — 250 g portion</Note>
      <MacroEnergySplit macros={{ protein: 21, carbs: 44, fat: 3.5 }} />
      <MacroGroup macros={{ protein: 21, carbs: 44, fat: 3.5 }} />
    </Frame>
  ),
};

/** A ratio where the grams mislead: 19 g of protein and 22 g of fat look
 *  alike by weight, but fat is 40% of the energy and protein 15%. Shares are
 *  rounded by largest remainder so the three always total 100. */
export const FatLed = {
  name: 'Fat-led ratio',
  render: () => (
    <Frame>
      <Stack gap={32}>
        <div>
          <Note>Roast squash &amp; red lentils — per serving</Note>
          <MacroEnergySplit macros={{ protein: 19, carbs: 57, fat: 22 }} />
          <MacroGroup macros={{ protein: 19, carbs: 57, fat: 22 }} />
        </div>
        <div>
          <Note>Greek yoghurt — a near-zero fat value that is genuinely near zero</Note>
          <MacroEnergySplit macros={{ protein: 17, carbs: 6, fat: 0.4 }} />
          <MacroGroup macros={{ protein: 17, carbs: 6, fat: 0.4 }} />
        </div>
      </Stack>
    </Frame>
  ),
};

/** Nothing is drawn when any macro is unavailable or the total is zero.
 *  Unknown is never treated as zero: MacroGroup says "Not available" in words
 *  and the section keeps its existing shape. Recalculating is different: the
 *  figures are still real, so the block stays and dims in place — no layout
 *  shift — and is announced as recalculating rather than as fresh data. */
export const Hidden = {
  name: 'Incomplete data — hidden',
  render: () => (
    <Frame>
      <Stack gap={32}>
        <div>
          <Note>Protein known, carbohydrate and fat not — no split</Note>
          <MacroEnergySplit macros={{ protein: 21, carbs: null, fat: null }} />
          <MacroGroup macros={{ protein: 21, carbs: null, fat: null }} />
        </div>
        <div>
          <Note>Recalculating — the split dims in place, nothing moves</Note>
          <MacroEnergySplit macros={{ protein: 19, carbs: 57, fat: 22 }} pending />
          <MacroGroup macros={{ protein: 19, carbs: 57, fat: 22 }} pending />
        </div>
      </Stack>
    </Frame>
  ),
};
