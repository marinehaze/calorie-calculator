import { MethodList, MethodStep } from './MethodList';
import { Frame, Note } from '../../lib/Frame';

export default {
  title: 'Food & Recipe/Method List',
  component: MethodList,
};

/** Recipe Detail's one dedicated state is "ingredients, steps and nutrition in
 *  one readable scroll". This is the steps.
 *
 *  Space separates them, never a card — the same rule that keeps the nutrition
 *  ladder out of boxes. The number is a CSS counter on the <ol>, so the markup
 *  carries the order and the figure can never disagree with it. */
export const Method = {
  render: () => (
    <Frame>
      <Note>Method</Note>
      <MethodList>
        <MethodStep>Warm the oil in a wide pan and soften the onion for eight minutes, until it stops squeaking.</MethodStep>
        <MethodStep>Stir in the cumin and coriander and let them toast for a minute.</MethodStep>
        <MethodStep>Add the lentils and stock, bring to a simmer, and leave uncovered for 25 minutes.</MethodStep>
        <MethodStep>Blend half the pan and return it — the soup thickens without any cream.</MethodStep>
        <MethodStep>Finish with lemon juice and salt. Taste, then add more lemon than feels sensible.</MethodStep>
      </MethodList>
    </Frame>
  ),
};

/** Two edges worth seeing: a step long enough to wrap several lines, and a
 *  list that runs into double figures, where the tabular number keeps 9 and 10
 *  on the same axis instead of nudging the column. */
export const EdgeCases = {
  render: () => (
    <Frame>
      <Note>A long step, and a list that reaches double figures</Note>
      <MethodList>
        <MethodStep>Heat the oven to 200°C fan.</MethodStep>
        <MethodStep>
          Toss the squash with the oil, the chilli flakes and a good pinch of salt, spread it in a single
          layer with room between the pieces — crowd the tray and it steams instead of roasting — and give
          it 30 to 35 minutes, turning once at the halfway point.
        </MethodStep>
        <MethodStep>Cook the grains in salted water.</MethodStep>
        <MethodStep>Drain and spread them out to cool.</MethodStep>
        <MethodStep>Whisk the dressing.</MethodStep>
        <MethodStep>Shred the herbs.</MethodStep>
        <MethodStep>Toast the seeds until they colour.</MethodStep>
        <MethodStep>Fold the grains through the squash.</MethodStep>
        <MethodStep>Dress while everything is still warm.</MethodStep>
        <MethodStep>Scatter the seeds and herbs, and serve.</MethodStep>
      </MethodList>
    </Frame>
  ),
};
