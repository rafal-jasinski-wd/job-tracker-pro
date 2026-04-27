import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars so VITE_JOOBLE_API_KEY is available in the proxy config
  // but is NEVER injected into the browser bundle
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        // In dev, proxy /api/jobs to Jooble — key stays in Node process only
        '/api/jobs': {
          target: `https://jooble.org/api/${env.VITE_JOOBLE_API_KEY}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/jobs/, ''),
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/firebase')) return 'vendor-firebase';
            if (id.includes('node_modules/recharts')) return 'vendor-recharts';
            if (id.includes('node_modules/@hello-pangea/dnd')) return 'vendor-dnd';
          }
        }
      }
    }
  };
});
