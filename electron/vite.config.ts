import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: path.join(__dirname, 'main.ts')
        }
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: path.join(__dirname, 'preload.ts')
        }
      }
    }
  },
  renderer: {
    root: path.join(__dirname, 'renderer'),
    build: {
      rollupOptions: {
        input: {
          index: path.join(__dirname, 'index.html')
        }
      }
    },
    plugins: [react()]
  }
});