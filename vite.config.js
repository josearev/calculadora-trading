import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  base: '', // Cambia la base a una cadena vacía para rutas relativas
  test: {
    environment: 'jsdom',
  },
});
