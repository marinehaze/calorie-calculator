import { useState } from 'react';
import { Stepper } from './Stepper';
import { Frame, Stack, Note } from '../../lib/Frame';

export default {
  title: 'Input & Navigation/Stepper',
  component: Stepper,
};

/** Servings on Recipe Detail, and the amount inside the portion sheet.
 *  Changing either recomputes the figures in place — there is no confirm. */
export const ServingsAndPortion = {
  render: () => {
    const [servings, setServings] = useState(4);
    const [grams, setGrams] = useState(340);
    return (
      <Frame>
        <Stack gap={32}>
          <div>
            <Note>Recipe Detail — servings</Note>
            <Stepper label="Servings" value={servings} onChange={setServings} min={1} max={12} />
          </div>
          <div>
            <Note>Portion sheet — amount, stepping in 10 g</Note>
            <Stepper label="Amount" value={grams} unit="g" step={10} min={10} max={2000} onChange={setGrams} />
          </div>
          <div>
            <Note>At the minimum — decrease is disabled, and stays readable</Note>
            <Stepper label="Servings" value={1} min={1} max={12} onChange={() => {}} />
          </div>
        </Stack>
      </Frame>
    );
  },
};
