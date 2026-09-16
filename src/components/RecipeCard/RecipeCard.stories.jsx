import { RecipeCard, RecipeList } from './RecipeCard';
import { Frame } from '../../lib/Frame';
import { recipes } from '../../lib/sampleData';

export default {
  title: 'Food & Recipe/Recipe Card',
  component: RecipeCard,
};

/** Recipe Discovery. Deliberately not a box: media with a radius, then type on
 *  the screen's own ground. A container around every recipe would turn this
 *  into an ecommerce grid, and the photography already separates the items.
 *
 *  24px between the crop and the title — enough that the title is not sitting
 *  on the photograph, not so much that the card reads as two blocks. */
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
