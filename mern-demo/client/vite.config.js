import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      allowedHosts: ['mern-frontend-236356.onrender.com'],
      watch: { usePolling: true },
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://host.docker.internal:5000',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})