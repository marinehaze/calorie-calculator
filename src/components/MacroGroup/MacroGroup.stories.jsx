import { MacroGroup } from './MacroGroup';
import { Frame, Stack, Note } from '../../lib/Frame';

export default {
  title: 'Nutrition/Macro Group',
  component: MacroGroup,
};

/** Three columns, one grid, equal weight. No bars, no rings, no stacked chart:
 *  DECISIONS.md removed red/amber/green from nutrition values — nothing turns
 *  red at someone for eating. */
export const Default = {
  render: () => (
    <Frame>
      <Stack gap={32}>
        <div><Note>Roast squash &amp; red lentils</Note><MacroGroup macros={{ protein: 19, carbs: 58, fat: 22 }} /></div>
        <div><Note>Greek yoghurt — a decimal, and a value near zero that is genuinely near zero</Note>
          <MacroGroup macros={{ protein: 17, carbs: 6, fat: 0.4 }} />
        </div>
        <div><Note>Lentil soup</Note><MacroGroup macros={{ protein: 13, carbs: 36, fat: 4.5 }} /></div>
      </Stack>
    </Frame>
  ),
};

/** The macro dots are decorative reinforcement of a label that is always
 *  present. That is what lets the carbs marker (#A57D31, 3.77 : 1) exist at
 *  all: it never has to carry meaning on its own. */
export const PartiallyUnavailable = {
  render: () => (
    <Frame>
      <Note>A database entry with protein but no carbohydrate or fat detail</Note>
      <MacroGroup macros={{ protein: 21, carbs: null, fat: null }} />
    </Frame>
  ),
};

/** Recalculating after a portion edit. */
export const Recalculating = {
  render: () => (
    <Frame>
      <MacroGroup macros={{ protein: 19, carbs: 58, fat: 22 }} pending />
    </Frame>
  ),
};
