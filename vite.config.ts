import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Repo name is `-` → site root https://<user>.github.io/-/
const GH_PAGES_BASE = '/-/';

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
