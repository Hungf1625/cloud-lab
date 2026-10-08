import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
      host: true,
      port: 5173,
      allowedHosts: ['mern-frontend-236356.onrender.com'],
      watch: { usePolling: true },
    proxy: {                        
      '/api': {
        target: 'http://host.docker.internal:5000',
        changeOrigin: true
      }
    }
  }
})
