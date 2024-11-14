// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Root directory for the project
  root: './src',

  // Server configuration
  server: {
    port: 3000,           // Specify the port for the dev server
    open: true,           // Automatically open the browser
    proxy: {              // Proxy API requests
      '/api': 'http://localhost:5000'
    }
  },

  // Build configuration
  build: {
    outDir: 'dist',       // Output directory for the build
    sourcemap: true,      // Generate source maps
    minify: 'terser',     // Minification using Terser
    chunkSizeWarningLimit: 1000,  // Warning if chunk size exceeds 1MB
  },

  // Alias for importing modules
  resolve: {
    alias: {
      '@': '/src',         // Replace '@' with '/src'
      '@components': '/src/components'
    }
  },

  // Plugins (optional)
  plugins: [
    // Add any Vite plugins here
  ]
});
