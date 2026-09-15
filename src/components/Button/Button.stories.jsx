import { Button } from './Button';
import { Frame, Stack, Note } from '../../lib/Frame';
import { IconPlus } from '../../lib/icons';

export default {
  title: 'Actions/Button',
  component: Button,
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'quiet'] },
    size: { control: 'inline-radio', options: ['default', 'small'] },
  },
};

export const Primary = {
  args: { children: 'Add to my day', variant: 'primary', fullWidth: true },
  render: (args) => <Frame><Button {...args} /></Frame>,
};

/** The three variants, at the width they are actually used: full-bleed inside
 *  a 390px screen with 24px margins. */
export const Variants = {
  render: () => (
    <Frame>
      <Stack gap={24}>
        <div><Note>Primary — one per surface</Note><Button variant="primary" fullWidth>Add to my day</Button></div>
        <div><Note>Secondary — the hairline alternative</Note><Button variant="secondary" fullWidth>Change portion</Button></div>
        <div><Note>Quiet — a supporting action that repeats</Note>
          <Button variant="quiet" fullWidth iconBefore={<IconPlus size={20} />}>Add another item</Button>
        </div>
      </Stack>
    </Frame>
  ),
};

/** Disabled stays readable: ink-2 on soft fill is 4.92 : 1, well over the 4.5
 *  AA threshold. It is reduced, not faded out. */
export const States = {
  render: () => (
    <Frame>
      <Stack gap={24}>
        <div><Note>Default</Note><Button fullWidth>Apply filters</Button></div>
        <div><Note>Loading — the label holds the width, no reflow</Note>
          <Button fullWidth loading loadingLabel="Applying filters">Apply filters</Button>
        </div>
        <div><Note>Disabled — still readable at 4.92 : 1</Note><Button fullWidth disabled>Apply filters</Button></div>
        <div><Note>Disabled secondary</Note><Button variant="secondary" fullWidth disabled>Change portion</Button></div>
      </Stack>
    </Frame>
  ),
};

/** Small (44px) is the floor. It exists for a button that sits beside other
 *  controls, never for the primary action on a screen. */
export const Small = {
  render: () => (
    <Frame>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="small">Relax this filter</Button>
        <Button size="small" variant="secondary">Try “lentil”</Button>
      </div>
    </Frame>
  ),
};
