import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows access from network (useful for testing on mobile)
    port: process.env.PORT || 5173, // Use PORT from environment, fallback to 5173
    proxy: {
      '/api': {
        target: 'https://luxury-x-git-main-nasifs-projects-9e4adf21.vercel.app', // Backend server
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '') // Optional: Rewrite API path
      }
    }
  }
})
