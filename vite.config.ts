import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from '@esbuild-plugins/node-globals-polyfill';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react() , nodePolyfills()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      external: [
        /^node:.*/,  // Exclude all node built-ins
        '@google/generative-ai'  // Correct external path for GoogleGenerativeAI
      ]
    }
  }
});
