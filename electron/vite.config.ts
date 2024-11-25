import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: path.join(__dirname, 'main/index.ts')
        },
        external: ['@supabase/supabase-js', 'electron-store', 'howler']
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: path.join(__dirname, 'preload/index.ts')
        },
        external: ['electron']
      }
    }
  },
  renderer: {
    root: path.join(__dirname, 'renderer'),
    build: {
      outDir: path.join(__dirname, 'dist/renderer'),
      rollupOptions: {
        input: {
          index: path.join(__dirname, 'renderer/index.html')
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'renderer')
      }
    },
    plugins: [react()]
  }
});