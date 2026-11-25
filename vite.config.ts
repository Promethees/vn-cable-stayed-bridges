/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // three.js is a lazy chunk (~514 kB, only fetched when the 3D tab opens)
  build: { chunkSizeWarningLimit: 600 },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
