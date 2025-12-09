import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use a relative base so the app serves correctly on GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: './',
});



