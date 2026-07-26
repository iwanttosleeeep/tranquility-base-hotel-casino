import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // relative asset paths — required for GitHub Pages subpath hosting
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/') || id.includes('/node_modules/scheduler/')) {
            return 'vendor-react';
          }
          if (id.includes('/node_modules/@supabase/') || id.includes('/node_modules/iceberg-js/')) {
            return 'vendor-supabase';
          }
          if (id.includes('/node_modules/motion/') || id.includes('/node_modules/motion-dom/') || id.includes('/node_modules/motion-utils/') || id.includes('/node_modules/framer-motion/')) {
            return 'vendor-motion';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
