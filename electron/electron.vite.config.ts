import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  main: {
    build: {
      outDir: 'out/main',
      rollupOptions: {
        external: ['dotenv', 'systeminformation']
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
        '@': path.resolve('src'),
        '@renderer': path.resolve('src/renderer'),
        '@supabase/supabase-js': path.resolve('node_modules/@supabase/supabase-js/dist/module/index.js')
      }
    },
    optimizeDeps: {
      include: ['@supabase/supabase-js']
    }
  }
})