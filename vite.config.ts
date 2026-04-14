import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Project Pages: https://<user>.github.io/ai-trainer/
const GH_PAGES_BASE = '/ai-trainer/';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? GH_PAGES_BASE : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@tokens': path.resolve(__dirname, 'tokens'),
    },
  },
}));
