import { PortionPair } from './PortionPair';
import { Frame, Stack, Note } from '../../lib/Frame';

export default {
  title: 'Nutrition/Portion Pair',
  component: PortionPair,
};

/** The second level of the hierarchy, and a pair rather than two facts:
 *  per-100 g is what makes the portion figure comparable. */
export const Default = {
  render: () => (
    <Frame>
      <Stack gap={32}>
        <div><Note>A cooked dish</Note><PortionPair portion="340 g" per100="151 kcal" /></div>
        <div><Note>A packaged product</Note><PortionPair portion="170 g pot" per100="57 kcal" /></div>
        <div><Note>A countable item — the portion is not always a weight</Note>
          <PortionPair portion="1 pitta" per100="264 kcal" />
        </div>
      </Stack>
    </Frame>
  ),
};

/** Incomplete data: "Not available" in words. Rendering 0 kcal per 100 g would
 *  state something untrue about the food. */
export const Unavailable = {
  render: () => (
    <Frame>
      <PortionPair portion="1 wrap" per100={null} />
    </Frame>
  ),
};
