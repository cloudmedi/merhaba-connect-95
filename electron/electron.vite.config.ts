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
          'crypto',
          'clsx',
          'tailwind-merge',
          'lucide-react',
          'bufferutil',
          'utf-8-validate',
          'ws'
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
        }
      }
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../src'),
        '@renderer': path.resolve(__dirname, 'src/renderer'),
        '@ui': path.resolve(__dirname, '../src/components/ui')
      }
    }
  }
})