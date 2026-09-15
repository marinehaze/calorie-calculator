import { useState } from 'react';
import { TabBar } from './TabBar';
import { Frame } from '../../lib/Frame';

export default {
  title: 'Input & Navigation/Tab Bar',
  component: TabBar,
};

/** Two tabs is the entire navigation model. SCREENS.md rules out a home
 *  screen: it would be a menu of the two items the tab bar already is. */
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
