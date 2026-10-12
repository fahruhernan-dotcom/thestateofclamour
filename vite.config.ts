import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api-artatix/': {
        target: 'https://api.artatix.co.id/api/v1/',
        changeOrigin: true,
        timeout: 8000,
        rewrite: (path) => path.replace(/^\/api-artatix\//, ''),
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            if (res && 'writeHead' in res && typeof res.writeHead === 'function') {
              try {
                res.writeHead(504, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Artatix proxy timeout', error: err.message }));
              } catch {
                // ignore
              }
            }
          });
        }
      }
    }
  }
});
