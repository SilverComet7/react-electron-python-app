import { defineConfig } from 'vite'
import electron from 'vite-electron-plugin'
import { customStart } from 'vite-electron-plugin/plugin'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    electron({
      include: ['src/main'],
      plugins: [
        customStart(),
      ],
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': resolve('src/renderer')
    }
  },
  build: {
    minify: false,
    sourcemap: true
  },
  server: {
    host: '127.0.0.1',
    port: 5173
  }
}) 