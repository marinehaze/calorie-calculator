import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';
import { Frame, Stack, Note } from '../../lib/Frame';

export default {
  title: 'Input & Navigation/Segmented Control',
  component: SegmentedControl,
};

/** Portion / Per 100 g on Nutrition Result. It changes the basis of the number
 *  on screen, not the screen — so it is a radiogroup, not a tab list. */
export const PortionBasis = {
  name: 'Default — Portion / 100 g',
  render: () => {
    const [v, setV] = useState('portion');
    return (
      <Frame>
        <Stack gap={24}>
          <div>
            <Note>Two options — the only use in the four screens</Note>
            <SegmentedControl
              label="Show nutrition per"
              value={v}
              onChange={setV}
              options={[{ value: 'portion', label: 'Portion' }, { value: '100g', label: '100 g' }]}
            />
          </div>
          <div>
            <Note>Disabled — incomplete data, no per-100 g basis to switch to</Note>
            <SegmentedControl
              label="Show nutrition per"
              value="portion"
              disabled
              options={[{ value: 'portion', label: 'Portion' }, { value: '100g', label: '100 g' }]}
            />
          </div>
        </Stack>
      </Frame>
    );
  },
};

/** The text variant, used where the switch is only a mode and something below
 *  it is the real interaction — Grams / Portions in the portion sheet. Same
 *  radiogroup, same arrow keys, same 44px targets; no track, and the active
 *  option is marked by berry, medium weight and an underline together. */
export const TextVariant = {
  name: 'Text — Grams / Portions',
  render: () => {
    const [v, setV] = useState('g');
    return (
      <Frame>
        <Stack gap={24}>
          <div>
            <Note>Active carries three marks, so the state is never hue alone</Note>
            <SegmentedControl
              variant="text"
              label="Unit"
              value={v}
              onChange={setV}
              options={[{ value: 'g', label: 'Grams' }, { value: 'portion', label: 'Portions' }]}
            />
          </div>
          <div style={{ filter: 'grayscale(1)' }}>
            <Note>Greyscale — the underline and weight still read</Note>
            <SegmentedControl
              variant="text"
              label="Unit, greyscale"
              value={v}
              onChange={setV}
              options={[{ value: 'g', label: 'Grams' }, { value: 'portion', label: 'Portions' }]}
            />
          </div>
        </Stack>
      </Frame>
    );
  },
};
