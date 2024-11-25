import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  main: {
    build: {
      outDir: 'out/main',
    }
  },
  preload: {
    build: {
      outDir: 'out/preload',
    }
  },
  renderer: {
    root: 'src/renderer',
    build: {
      outDir: 'out/renderer',
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
      },
      watch: {
        usePolling: true
      }
    }
  }
})