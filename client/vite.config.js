import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // 👈 Add this!
  plugins: [react()],
  server: {
    host: true,
    port: process.env.PORT || 5173,
    proxy: {
      '/api': {
        target: 'https://luxury-x.vercel.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
