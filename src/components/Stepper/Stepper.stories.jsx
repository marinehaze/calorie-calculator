import { useState } from 'react';
import { Stepper } from './Stepper';
import { Frame, Stack, Note } from '../../lib/Frame';

export default {
  title: 'Input & Navigation/Stepper',
  component: Stepper,
};

/** Servings on Recipe Detail: a labelled control sitting in a row of settings.
 *  Changing it recomputes the figures in place — there is no confirm.
 *
 *  The portion sheet's amount is the `bare` variant, below. */
export const Servings = {
  render: () => {
    const [servings, setServings] = useState(4);
    return (
      <Frame>
        <Stack gap={32}>
          <div>
            <Note>Recipe Detail — servings</Note>
            <Stepper label="Servings" value={servings} onChange={setServings} min={1} max={12} />
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

/** The bare variant, used in the portion sheet. No label, no track — the three
 *  parts are bound by alignment and open space. The buttons keep the full 44px
 *  target; they are quieter, not smaller. The 24px value is deliberately below
 *  the 40px calorie figure it feeds. */
export const Bare = {
  render: () => {
    const [grams, setGrams] = useState(340);
    const [portions, setPortions] = useState(1);
    return (
      <Frame>
        <Stack gap={32}>
          <div>
            <Note>Grams</Note>
            <Stepper variant="bare" label="amount" value={grams} unit="g" step={10} min={10} max={2000} onChange={setGrams} />
          </div>
          <div>
            <Note>Portions — the unit word pluralises with the value</Note>
            <Stepper
              variant="bare" label="amount" value={portions}
              unit={portions === 1 ? 'portion' : 'portions'}
              min={1} max={20} onChange={setPortions}
            />
          </div>
          <div>
            <Note>At the minimum — decrease disabled, still readable</Note>
            <Stepper variant="bare" label="amount" value={10} unit="g" step={10} min={10} max={2000} onChange={() => {}} />
          </div>
        </Stack>
      </Frame>
    );
  },
};
