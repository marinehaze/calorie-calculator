import { useState } from 'react';
import { SearchField } from './SearchField';
import { Frame, Stack, Note } from '../../lib/Frame';

export default {
  title: 'Input & Navigation/Search Field',
  component: SearchField,
};

const Live = (props) => {
  const [value, setValue] = useState(props.initial ?? '');
  return <SearchField {...props} value={value} onChange={setValue} onClear={() => setValue('')} />;
};

/** Food Search: the barcode action lives inside the field, because SCREENS.md
 *  treats scanning as an input shortcut on this screen rather than a flow. */
export const FoodSearch = {
  render: () => (
    <Frame>
      <Stack gap={24}>
        <div><Note>Empty — barcode offered as the alternative input</Note>
          <Live id="s1" onScan={() => {}} placeholder="Search foods and products" />
        </div>
        <div><Note>Typed — clear appears beside the barcode action</Note>
          <Live id="s2" initial="greek yoghurt" onScan={() => {}} />
        </div>
        <div><Note>Searching</Note>
          <SearchField id="s3" value="red lent" onScan={() => {}} loading />
        </div>
        <div><Note>Disabled — offline</Note>
          <SearchField id="s4" value="" onScan={() => {}} disabled placeholder="Search unavailable offline" />
        </div>
      </Stack>
    </Frame>
  ),
};

/** Recipe Discovery uses the same field without the barcode action — the only
 *  difference between the two usages. */
export const RecipeSearch = {
  render: () => (
    <Frame>
      <Note>No barcode: a recipe has no barcode to scan</Note>
      <Live id="s5" initial="lentil" label="Search recipes" placeholder="Search recipes" />
    </Frame>
  ),
};

/** A long query still has to clear and scan. Nothing overflows at 390px. */
export const LongQuery = {
  render: () => (
    <Frame>
      <Live id="s6" initial="wholemeal pitta bread with sesame" onScan={() => {}} />
    </Frame>
  ),
};
