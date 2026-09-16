import '../src/styles/fonts.css';
import '../src/styles/tokens.css';
import '../src/styles/base.css';

/** @type {import('@storybook/react-vite').Preview} */
export default {
  // 'fullscreen' rather than 'centered': the centred layout adds its own
  // horizontal padding, which pushes a 390px frame past a 390px viewport and
  // makes a real overflow check impossible. Frames centre themselves instead.
  decorators: [(Story) => <div style={{ padding: '24px 0' }}><Story /></div>],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      options: {
        canvas: { name: 'Canvas', value: '#FBFAF8' },
        surface: { name: 'Surface', value: '#FFFFFF' },
      },
    },
    controls: { matchers: { color: /(background|color)$/i } },
    options: {
      storySort: {
        order: [
          'Foundations',
          ['Colour', 'Typography', 'Layout & Spacing', 'Accessibility'],
          'Actions',
          'Input & Navigation',
          'Nutrition',
          'Food & Recipe',
          'Feedback & States',
          'Screens',
          ['Food Search', 'Nutrition Result'],
          'Overview',
        ],
      },
    },
  },
  initialGlobals: { backgrounds: { value: 'canvas' } },
};
