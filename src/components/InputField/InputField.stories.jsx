import { useState } from 'react';
import { InputField } from './InputField';
import { Frame, Stack, Note } from '../../lib/Frame';

export default {
  title: 'Input & Navigation/Input Field',
  component: InputField,
};

/** The manual-entry set, as it appears in the sheet. SCREENS.md gives the
 *  no-results state three recovery paths and this is the third: the user
 *  types what the database does not have.
 *
 *  Calories is the only required value, because it is the answer the screen
 *  exists to give. The macro fields say "Optional" in words — leaving one
 *  blank is a legitimate answer, not an error, and what it produces is
 *  "Not available", never a zero. */
export const ManualEntryFields = {
  render: () => {
    const [v, setV] = useState({ name: 'Aunt’s lentil soup', kcal: '268', protein: '14', carbs: '', fat: '' });
    const set = (k) => (x) => setV((s) => ({ ...s, [k]: x }));
    return (
      <Frame>
        <Stack gap={20}>
          <InputField id="me-name" label="Food name" value={v.name} onChange={set('name')} placeholder="What is it?" />
          <InputField
            id="me-kcal"
            label="Calories"
            value={v.kcal}
            onChange={set('kcal')}
            inputMode="decimal"
            unit="kcal"
            unitLabel="kilocalories"
            hint="Per the portion you are entering, not per 100 g."
          />
          <InputField id="me-protein" label="Protein" value={v.protein} onChange={set('protein')} inputMode="decimal" unit="g" unitLabel="grams" optional />
          <InputField id="me-carbs" label="Carbohydrate" value={v.carbs} onChange={set('carbs')} inputMode="decimal" unit="g" unitLabel="grams" optional />
          <InputField id="me-fat" label="Fat" value={v.fat} onChange={set('fat')} inputMode="decimal" unit="g" unitLabel="grams" optional />
        </Stack>
      </Frame>
    );
  },
};

/** The states the field actually takes. The control block is SearchField's —
 *  same 56px height, radius, soft fill and whole-field focus ring — so the two
 *  fields read as one family rather than two systems. */
export const States = {
  render: () => (
    <Frame>
      <Stack gap={24}>
        <div>
          <Note>Empty, with a placeholder</Note>
          <InputField id="st-empty" label="Food name" placeholder="What is it?" />
        </div>
        <div>
          <Note>Numeric, with a trailing unit — spoken as “Calories in kilocalories”</Note>
          <InputField id="st-unit" label="Calories" value="412" inputMode="decimal" unit="kcal" unitLabel="kilocalories" />
        </div>
        <div>
          <Note>Optional, stated in words rather than an asterisk</Note>
          <InputField id="st-optional" label="Fat" value="" inputMode="decimal" unit="g" unitLabel="grams" optional />
        </div>
        <div>
          <Note>Disabled — readable, not faded out</Note>
          <InputField id="st-disabled" label="Per 100 g" value="151" inputMode="decimal" unit="kcal" unitLabel="kilocalories" disabled />
        </div>
      </Stack>
    </Frame>
  ),
};

/** A long label and a long value both have to survive 390px, since the field
 *  sits in a sheet with a 24px margin on either side. */
export const LongContent = {
  render: () => (
    <Frame>
      <InputField
        id="long"
        label="Carbohydrate, of which sugars"
        value="1284.75"
        inputMode="decimal"
        unit="g"
        unitLabel="grams"
        optional
      />
    </Frame>
  ),
};
