import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
