import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  main: {
    build: {
      outDir: 'out/main'
    }
  },
  preload: {
    build: {
      outDir: 'out/preload'
    }
  },
  renderer: {
    root: '.',
    build: {
      outDir: 'out/renderer'
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve('src'),
        '@renderer': path.resolve('src/renderer')
      }
    },
    base: './',
    server: {
      port: 3000
    }
  }
})