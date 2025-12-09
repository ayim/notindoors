import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use the repo slug as base so assets resolve correctly on GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: '/notindoors/',
});



