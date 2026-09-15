import { useState } from 'react';
import { NutritionSummary } from './NutritionSummary';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { Frame, Note } from '../../lib/Frame';
import { ingredients, roastSquashLentils, marketFalafel } from '../../lib/sampleData';

export default {
  title: 'Nutrition/Nutrition Summary',
  component: NutritionSummary,
};

/** The full block, as it appears on Nutrition Result.
 *  calories -> portion / per 100 g -> protein / carbs / fat -> ingredients.
 *  Nothing is boxed and nothing is charted: the levels are separated by space. */
export const Full = {
  render: () => {
    const [basis, setBasis] = useState('portion');
    const per100 = basis === '100g';
    return (
      <Frame>
        <NutritionSummary
          title="Nutrition"
          basis={
            <SegmentedControl
              label="Show nutrition per"
              value={basis}
              onChange={setBasis}
              options={[{ value: 'portion', label: 'Portion' }, { value: '100g', label: '100 g' }]}
            />
          }
          kcal={per100 ? 151 : roastSquashLentils.kcal}
          portion={roastSquashLentils.portion}
          per100={roastSquashLentils.per100}
          macros={per100 ? { protein: 5.6, carbs: 17, fat: 6.5 } : roastSquashLentils.macros}
          ingredients={ingredients}
          note="Estimated from a verified database entry. Portions you set yourself are the largest source of variation."
        />
      </Frame>
    );
  },
};

/** The same block summarised on Recipe Detail — 56px hero, tighter rhythm, no
 *  ingredient list because the recipe already listed them further up. This
 *  overlap is what makes the two stories one app. */
export const Summary = {
  render: () => (
    <Frame>
      <NutritionSummary
        variant="summary"
        title="Per serving"
        kcal={438}
        portion="1 of 2 servings"
        per100="128 kcal"
        macros={{ protein: 12, carbs: 54, fat: 19 }}
      />
    </Frame>
  ),
};

/** Incomplete nutrition data: fewer figures, each missing one said in words.
 *  A component variation, not a different layout. */
export const IncompleteData = {
  render: () => (
    <Frame>
      <Note>An entry with calories but no macro breakdown</Note>
      <NutritionSummary
        title="Nutrition"
        kcal={marketFalafel.kcal}
        portion={marketFalafel.portion}
        per100={marketFalafel.per100}
        macros={marketFalafel.macros}
        note="This entry has no carbohydrate or fat breakdown. The calorie figure is still from the database."
      />
    </Frame>
  ),
};

/** Recalculating after a portion edit — every figure dims together, in place. */
export const Recalculating = {
  render: () => (
    <Frame>
      <NutritionSummary
        title="Nutrition"
        kcal={612}
        portion="410 g"
        per100="151 kcal"
        macros={{ protein: 23, carbs: 70, fat: 26 }}
        pending
      />
    </Frame>
  ),
};
