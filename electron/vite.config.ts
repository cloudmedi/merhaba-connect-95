import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: path.join(__dirname, 'main.ts')
      },
      rollupOptions: {
        external: ['@supabase/supabase-js', 'electron-store', 'howler']
      }
    }
  },
  preload: {
    build: {
      lib: {
        entry: path.join(__dirname, 'preload.ts')
      },
      rollupOptions: {
        external: ['electron']
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@': path.resolve('src')
      }
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          index: path.join(__dirname, 'index.html')
        }
      }
    }
  }
});