import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: false,
    env: { VITE_MAPBOX_TOKEN: 'pk.test_token_for_vitest' },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['__mocks__/**', 'src/main.tsx'],
    },
  },
});
