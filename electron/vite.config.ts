import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "../src"),
      '@renderer': path.resolve(__dirname, "./src/renderer"),
      '@components': path.resolve(__dirname, "../src/components"),
      '@ui': path.resolve(__dirname, "../src/components/ui"),
      '@lib': path.resolve(__dirname, "../src/lib")
    },
  },
})