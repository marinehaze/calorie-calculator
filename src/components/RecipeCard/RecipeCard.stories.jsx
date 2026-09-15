import { RecipeCard, RecipeList } from './RecipeCard';
import { Frame, Note } from '../../lib/Frame';
import { recipes } from '../../lib/sampleData';

export default {
  title: 'Food & Recipe/Recipe Card',
  component: RecipeCard,
};

/** Recipe Discovery. Deliberately not a box: media with a radius, then type on
 *  the screen's own ground. A container around every recipe would turn this
 *  into an ecommerce grid, and the photography already separates the items. */
export const Browse = {
  render: () => (
    <Frame background="canvas">
      <RecipeList>
        {recipes.slice(0, 3).map((r) => (
          <RecipeCard key={r.id} {...r} onClick={() => {}} />
        ))}
      </RecipeList>
    </Frame>
  ),
};

/** Compact, for when a longer filtered list needs to be scannable rather than
 *  browsable. */
export const Compact = {
  render: () => (
    <Frame background="canvas">
      <Note>Same data, denser list</Note>
      <RecipeList compact>
        {recipes.slice(2, 6).map((r) => (
          <RecipeCard key={r.id} {...r} compact onClick={() => {}} />
        ))}
      </RecipeList>
    </Frame>
  ),
};

/** A long title balances onto two lines without pushing the meta row out of
 *  the 342px content column. */
export const LongTitle = {
  render: () => (
    <Frame background="canvas">
      <RecipeList>
        <RecipeCard {...recipes[3]} onClick={() => {}} />
      </RecipeList>
    </Frame>
  ),
};
