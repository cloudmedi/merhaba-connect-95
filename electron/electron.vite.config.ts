import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  main: {
    build: {
      outDir: 'out/main',
      rollupOptions: {
        external: [
          'dotenv', 
          'systeminformation', 
          '@supabase/supabase-js', 
          'uuid', 
          'sonner',
          'node-fetch',
          'fs-extra',
          'crypto'
        ]
      }
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
      outDir: 'out/renderer',
      rollupOptions: {
        input: {
          index: path.join(__dirname, 'index.html')
        },
        external: ['sonner']
      }
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve('src'),
        '@renderer': path.resolve('src/renderer')
      }
    }
  }
})