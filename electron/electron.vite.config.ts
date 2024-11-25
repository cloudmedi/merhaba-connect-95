import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  main: {
    plugins: [],
    build: {
      outDir: 'out/main',
      rollupOptions: {
        input: {
          index: path.join(__dirname, 'src/main/index.ts'),
        },
      },
    }
  },
  preload: {
    plugins: [],
    build: {
      outDir: 'out/preload',
      rollupOptions: {
        input: {
          index: path.join(__dirname, 'src/preload/index.ts'),
        },
      },
    }
  },
  renderer: {
    root: path.join(__dirname, 'src/renderer'),
    build: {
      outDir: 'out/renderer',
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@renderer': path.resolve(__dirname, 'src/renderer'),
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      headers: {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
        'Content-Type': 'application/javascript; charset=utf-8'
      }
    }
  }
})