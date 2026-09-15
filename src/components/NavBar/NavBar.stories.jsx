import { NavBar } from './NavBar';
import { IconButton } from '../IconButton/IconButton';
import { Frame, Stack, Note } from '../../lib/Frame';
import { IconFilter } from '../../lib/icons';

export default {
  title: 'Input & Navigation/Nav Bar',
  component: NavBar,
};

export const Variants = {
  render: () => (
    <Frame>
      <Stack gap={32}>
        <div>
          <Note>Back only — Nutrition Result, where the dish name is the largest thing below and a title would compete</Note>
          <NavBar onBack={() => {}} />
        </div>
        <div>
          <Note>Back and title — Recipe Detail</Note>
          <NavBar onBack={() => {}} title="Recipe" />
        </div>
        <div>
          <Note>Title and trailing action — Recipe Discovery</Note>
          <NavBar title="Recipes" trailing={<IconButton icon={<IconFilter />} label="Filters" />} />
        </div>
        <div>
          <Note>A long title truncates rather than wrapping the bar to two lines</Note>
          <NavBar onBack={() => {}} title="Chickpea, herb & preserved lemon bowl" />
        </div>
      </Stack>
    </Frame>
  ),
};
