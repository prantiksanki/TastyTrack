import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor packages
          if (id.includes('node_modules')) {
            if (id.includes('lottie')) return 'lottie'
            if (id.includes('html2canvas')) return 'html2canvas'
            if (id.includes('react')) return 'react-vendor'
            return 'vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 700, // optional: increase warning limit
  },
})
