import { useState } from 'react';
import { TabBar } from './TabBar';
import { Frame } from '../../lib/Frame';

export default {
  title: 'Input & Navigation/Tab Bar',
  component: TabBar,
};

/** Two tabs is the entire root navigation model. SCREENS.md rules out a home
 *  screen: it would be a menu of the two items the tab bar already is.
 *
 *  Shown on Food Search and Recipe Discovery only. Nutrition Result and Recipe
 *  Detail are drill-downs and use a back control instead. */
export const TwoTabs = {
  render: () => {
    const [tab, setTab] = useState('calculate');
    return (
      <Frame padded={false}>
        <TabBar value={tab} onChange={setTab} />
      </Frame>
    );
  },
};
