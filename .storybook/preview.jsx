import '../src/styles/fonts.css';
import '../src/styles/tokens.css';
import '../src/styles/base.css';
import './preview.css';

/** @type {import('@storybook/react-vite').Preview} */
export default {
  // 'fullscreen' rather than 'centered': the centred layout adds its own
  // horizontal padding, which pushes a 390px frame past a 390px viewport and
  // makes a real overflow check impossible. Frames centre themselves instead.
  /* `deviceFrame` opts a story into the review-only device stage: a darker
     ground behind the frame, a drop shadow, a simulated bottom safe area and
     a home indicator. The four screens use it; design system stories do not,
     so their approved presentation is untouched. See preview.css. */
  decorators: [
    (Story, context) =>
      context.parameters.deviceFrame
        ? <div className="sb-device"><Story /></div>
        : <div style={{ padding: '24px 0' }}><Story /></div>,
  ],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      options: {
        canvas: { name: 'Canvas', value: '#FBFAF8' },
        surface: { name: 'Surface', value: '#FFFFFF' },
        stage: { name: 'Device stage', value: '#CFC8BE' },
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
