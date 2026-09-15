import { Banner } from './Banner';
import { Frame, Stack, Note } from '../../lib/Frame';

export default {
  title: 'Feedback & States/Banner',
  component: Banner,
};

/** The one app-wide offline / error surface, defined once for all four screens.
 *  It is not red: DECISIONS.md removed alarm colour from this product, and a
 *  dropped connection is not the user's mistake. */
export const Tones = {
  render: () => (
    <Frame>
      <Stack gap={16}>
        <div><Note>Offline — a standing notice, announced without interrupting</Note>
          <Banner tone="offline" title="You’re offline." body="Showing the last results we loaded." actionLabel="Retry" onAction={() => {}} />
        </div>
        <div><Note>Error — announced immediately</Note>
          <Banner tone="error" title="Couldn’t load nutrition data." body="The figures below may be incomplete." actionLabel="Retry" onAction={() => {}} />
        </div>
        <div><Note>No action — nothing for the user to do yet</Note>
          <Banner tone="offline" title="You’re offline." body="Search will work again once you reconnect." />
        </div>
      </Stack>
    </Frame>
  ),
};
