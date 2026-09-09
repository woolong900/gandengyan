import { defineConfig } from 'vite';

export default defineConfig({
  base: '',
  build: {
    outDir: 'dist',
    // public/assets 会原样拷到 dist/assets，打包产物另放一个目录避免混在一起
    assetsDir: 'bundle',
    assetsInlineLimit: 0,
    target: 'es2020',
  },
  server: {
    host: true,
    port: 5173,
  },
});
