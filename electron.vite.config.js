import { defineConfig } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    build: {
      outDir: 'out/main',
      lib: {
        entry: 'src/main/index.js'
      }
    }
  },
  preload: {
    build: {
      outDir: 'out/preload',
      lib: {
        entry: 'src/preload/index.js'
      }
    }
  },
  renderer: {
    root: 'src/renderer',
    build: {
      outDir: 'out/renderer',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html')
        }
      }
    }
  }
}) 