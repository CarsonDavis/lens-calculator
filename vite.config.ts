import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    watch: {
      ignored: ['**/reference-repos/**', '**/node_modules/**'],
    },
  },
  optimizeDeps: {
    entries: ['./src/**/*.{ts,tsx}', './index.html'],
    exclude: ['reference-repos'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: [/reference-repos/],
    },
  },
});
