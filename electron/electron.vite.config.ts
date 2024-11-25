import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  main: {
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
    }
  }
})