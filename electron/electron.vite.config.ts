import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  main: {
    build: {
      outDir: 'dist/main'
    }
  },
  preload: {
    build: {
      outDir: 'dist/preload'
    }
  },
  renderer: {
    root: '.',
    build: {
      outDir: 'dist/renderer'
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@renderer': path.resolve(__dirname, 'src/renderer')
      }
    }
  }
})