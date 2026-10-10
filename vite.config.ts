import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api-artatix': {
        target: 'https://api.artatix.co.id/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-artatix/, '')
      }
    }
  }
});
