import { SkeletonResultList, SkeletonRecipeCards } from './Skeleton';
import { Frame, Note } from '../../lib/Frame';

export default {
  title: 'Feedback & States/Skeleton',
};

/** One loading pattern for list rows. Each skeleton occupies the same box as
 *  the row that replaces it, so nothing reflows when the data lands. */
export const SearchResults = {
  render: () => (
    <Frame>
      <Note>Food Search — sub-second against a hosted database</Note>
      <SkeletonResultList rows={4} />
    </Frame>
  ),
};

/** And one for recipe cards. */
export const RecipeCards = {
  render: () => (
    <Frame background="canvas">
      <SkeletonRecipeCards cards={2} />
    </Frame>
  ),
};
