/** @type {import('@storybook/react-vite').StorybookConfig} */
export default {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  // The approved food photography lives at the repo root and is shared with
  // branding/stylescape.html. Serve it at /food rather than duplicating it.
  staticDirs: [{ from: '../assets/food', to: '/food' }],
};
