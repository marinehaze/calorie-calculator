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
