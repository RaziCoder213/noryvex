import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        about: './about/index.html',
        contact: './contact/index.html',
        solutions: './solutions/index.html',
        liveDemo: './live-demo/index.html',
        privacy: './privacy/index.html',
        admin: './admin/index.html',
        notFound: './404.html',
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
