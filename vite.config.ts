import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  
  // 📂 Path Aliasing (Cleaner Imports)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // ⚡ Build Optimization
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    
    // 📦 Chunk Splitting for Better Caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/motion')) {
            return 'motion-vendor';
          }
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/lenis')) {
            return 'ui-vendor';
          }
        },
      },
    },
  },

  // 🗑️ Remove console.logs in Production
  esbuild: {
    drop: ['console', 'debugger'],
  },

  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});