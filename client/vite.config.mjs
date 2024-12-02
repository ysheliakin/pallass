import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
  plugins: [react(), tsconfigPaths()],
  base: mode === 'production' ? 'https://ysheliakin.github.io/pallass/' : './',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },
  // Allow PNG files as assets
  assetsInclude: ['**/*.PNG', '**/*.png'],
}));
