import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const srcPath = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(srcPath),
    },
  },
  server: {
    host: '127.0.0.1',
    strictPort: true,
    port: 3001,
    open: false,
  },
})
