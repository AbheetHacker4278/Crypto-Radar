import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { GoogleGenerativeAI } from './path/to/local/generative-ai';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      external: [
        'node:*',
        '@google/generative-ai' // Add this line
      ]
    }
  }
});
