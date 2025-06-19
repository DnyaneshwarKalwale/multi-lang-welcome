import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080,
    host: true, // Allow external hosts
    allowedHosts: [
      'app.brandout.ai',
      'localhost',
      '127.0.0.1',
      '.brandout.ai' // Allow all subdomains of brandout.ai
    ],
    hmr: {
      overlay: true,
    },
    proxy: {
      '/api': {
        target: 'https://api.brandout.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    // Exclude Git files from being watched
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.DS_Store',
        '**/Thumbs.db',
        '.git'
      ]
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-toast', '@radix-ui/react-dialog', '@radix-ui/react-slot'],
          'utils-vendor': ['axios', 'date-fns', 'framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
    exclude: ['.gitignore'],
  },
  define: {
    global: 'globalThis',
  },
});
