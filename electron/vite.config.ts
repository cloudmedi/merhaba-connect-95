import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: path.join(__dirname, 'src/main/main.ts')
        },
        external: ['@supabase/supabase-js', 'electron-store', 'howler']
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: path.join(__dirname, 'src/preload/preload.ts')
        },
        external: ['electron']
      }
    }
  },
  renderer: {
    root: path.join(__dirname, 'src/renderer'),
    build: {
      rollupOptions: {
        input: {
          index: path.join(__dirname, 'src/renderer/index.html')
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/renderer')
      }
    },
    plugins: [react()]
  }
});