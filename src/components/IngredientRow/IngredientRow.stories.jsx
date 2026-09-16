import { IngredientRow, IngredientList } from './IngredientRow';
import { Frame, Stack, Note } from '../../lib/Frame';
import { couscousIngredients } from '../../lib/sampleData';

export default {
  title: 'Nutrition/Ingredient Row',
  component: IngredientRow,
};

/** Amounts and calories hold fixed right-hand columns, so the figures form a
 *  column the eye can run down. */
export const List = {
  render: () => (
    <Frame>
      <IngredientList>
        {couscousIngredients.map((i) => (
          <IngredientRow key={i.id} name={i.name} amount={i.amount} kcal={i.kcal} />
        ))}
      </IngredientList>
    </Frame>
  ),
};

/** Real ingredient names are long, and a missing figure is stated, not zeroed. */
export const EdgeCases = {
  render: () => (
    <Frame>
      <Stack gap={32}>
        <div>
          <Note>A long name wraps; the number columns do not move</Note>
          <IngredientList>
            <IngredientRow name="Preserved lemon, rind only, finely chopped" amount="12 g" kcal={4} />
            <IngredientRow name="Extra virgin olive oil" amount="11 g" kcal={99} />
          </IngredientList>
        </div>
        <div>
          <Note>No calorie data for this entry — “n/a”, never 0</Note>
          <IngredientList>
            <IngredientRow name="Za’atar" amount="4 g" kcal={null} />
            <IngredientRow name="Sea salt" amount="2 g" kcal={0} />
          </IngredientList>
        </div>
      </Stack>
    </Frame>
  ),
};

/** Recipe Detail, when a recipe only partly matches the active filters. The
 *  sentence carries the meaning; the berry rule only helps you find it. */
export const FlaggedAgainstAFilter = {
  render: () => (
    <Frame>
      <Note>Active filter: No nuts</Note>
      <IngredientList>
        <IngredientRow name="Butternut squash" amount="180 g" kcal={115} />
        <IngredientRow name="Walnuts, toasted" amount="20 g" kcal={131} flag="Contains nuts — excluded by your filters" />
        <IngredientRow name="Feta" amount="30 g" kcal={79} />
      </IngredientList>
    </Frame>
  ),
};

/** Inside a multi-item dish on Nutrition Result, each row opens the item-swap
 *  sheet, so the row is a button with a 44px minimum. */
export const Interactive = {
  render: () => (
    <Frame>
      <Note>Tap a row to correct a mis-matched item</Note>
      <IngredientList label="Items in this dish">
        <IngredientRow name="Butternut squash" amount="180 g" kcal={115} onClick={() => {}} />
        <IngredientRow name="Red lentils, dry" amount="60 g" kcal={209} onClick={() => {}} />
      </IngredientList>
    </Frame>
  ),
};
