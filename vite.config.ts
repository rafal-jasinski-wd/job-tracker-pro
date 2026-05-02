/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars so JOOBLE_API_KEY is available in the proxy config.
  // Using '' as the prefix loads ALL env vars, not just VITE_* ones.
  // The key is NEVER injected into the browser bundle because it lacks the VITE_ prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        // In dev, proxy /api/jobs to Jooble — key stays in Node process only
        '/api/jobs': {
          target: `https://jooble.org/api/${env.JOOBLE_API_KEY}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/jobs/, ''),
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Split Firebase into auth (needed at boot) and firestore (deferred until logged in)
            if (id.includes('node_modules/firebase/auth') || id.includes('node_modules/@firebase/auth')) return 'vendor-firebase-auth';
            if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) return 'vendor-firebase-store';
            // Recharts + its d3 dependencies
            if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) return 'vendor-recharts';
            if (id.includes('node_modules/@hello-pangea/dnd')) return 'vendor-dnd';
          }
        }
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
    }
  };
});
