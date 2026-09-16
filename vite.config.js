import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Storybook's react-vite builder reads this config. The React plugin is
 * declared explicitly so JSX compiles with the automatic runtime and no file
 * needs to import React just to use JSX.
 */
export default defineConfig({
  plugins: [react()],
});
