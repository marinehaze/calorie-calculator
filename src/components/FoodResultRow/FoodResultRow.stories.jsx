import { FoodResultRow, FoodResultList } from './FoodResultRow';
import { Frame, Note } from '../../lib/Frame';
import { searchResults } from '../../lib/sampleData';

export default {
  title: 'Food & Recipe/Food Search Result Row',
  component: FoodResultRow,
};

/** Food Search, populated. Every row carries its own plausible figure — a
 *  yoghurt pot and a portion of dry lentils are not the same number. */
export const Results = {
  render: () => (
    <Frame>
      <FoodResultList>
        {searchResults.map((r) => (
          <FoodResultRow key={r.id} {...r} onClick={() => {}} />
        ))}
      </FoodResultList>
    </Frame>
  ),
};

/** The same pattern reused inside the item-swap sheet, exactly as SCREENS.md
 *  specifies — no new pattern, and no current-match state: the entry being
 *  replaced is simply not offered back. */
export const InTheSwapSheet = {
  render: () => (
    <Frame>
      <Note>Correcting a mis-matched item — alternatives only</Note>
      <FoodResultList label="Alternative matches">
        <FoodResultRow name="Red lentils, boiled" source="Generic · per 150 g" kcal={174} image={searchResults[2].image} onClick={() => {}} />
        <FoodResultRow name="Puy lentils, cooked" source="Merchant Gourmet · per 125 g" kcal={168} image={searchResults[0].image} onClick={() => {}} />
        <FoodResultRow name="Green lentils, canned, drained" source="Bonduelle · per 130 g" kcal={139} image={searchResults[2].image} onClick={() => {}} />
      </FoodResultList>
    </Frame>
  ),
};

/** Long names are common in a real product database. Two lines, then ellipsis
 *  — never a single truncated line that hides which of two similar products
 *  this is. */
export const LongNames = {
  render: () => (
    <Frame>
      <FoodResultList>
        <FoodResultRow
          name="Greek style natural yoghurt, 0% fat, with honey and toasted hazelnuts"
          source="Fage Total Split Cup · per 170 g pot"
          kcal={214}
          image={searchResults[1].image}
          onClick={() => {}}
        />
        <FoodResultRow
          name="Organic wholemeal stoneground pitta bread, pack of six"
          source="Sainsbury's · per pitta, 75 g"
          kcal={191}
          image={searchResults[3].image}
          onClick={() => {}}
        />
        <FoodResultRow
          name="Falafel wrap, market stall"
          source="User entry · unverified"
          kcal={null}
          image={searchResults[5].image}
          onClick={() => {}}
        />
      </FoodResultList>
    </Frame>
  ),
};
