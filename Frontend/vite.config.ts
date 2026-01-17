import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    
    // Environment variables configuration - point to env directory
    envDir: './env',
    envPrefix: 'VITE_',
    
    // Development server configuration
    server: {
      port: 3000,
      open: true,
    },
    
    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
    },
  }
})
