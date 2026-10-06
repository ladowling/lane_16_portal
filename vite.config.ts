import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // `npm run dev:local` points the app at /local-api, forwarded here to an API running on this machine
    // (see ../local-dev). Same-origin requests sidestep the API's CORS allow-list. Dev server only.
    proxy: {
      '/local-api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/local-api/, ''),
      },
    },
  },
});
