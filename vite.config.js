import { defineConfig, loadEnv } from 'vite';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default defineConfig({
  appType: "custom",
  base: "/",
  resolve: {
    alias: {
      '~': "./src",
      '~~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, './server'),
    },
  },
  plugins: [commonjs()],
  optimizeDeps: {exclude: ["fsevents"]},
  publicDir: './public',
  css: {
    devSourcemap: true
  },
  hmr: {
    clientPort: 5173
  },
  preview: {
    port: 8080,
  },
  ssr: {
    target: 'node'
  },
  server: {
    port: 5173,
    host: 'localhost',
    origin: 'http://127.0.0.1:3000',
    hmr: true,
    proxy: {
      // Proxying websockets or socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'build',
    assetsDir: 'assets',
    sourcemap: true,
    minify: false,
    manifest: true,
    ssrManifest: true,
    rollupOptions: {
      input: './src/main.js',
    }
  },
},({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // vite config
    define: {
      __APP_ENV__: env.APP_ENV,
    },
  }
})
