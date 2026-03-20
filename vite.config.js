import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/iesfabot-chat/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});