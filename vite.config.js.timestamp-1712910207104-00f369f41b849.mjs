// vite.config.js
import { defineConfig, loadEnv } from "file:///Users/Giovanni/Developer/API-2324/node_modules/.pnpm/vite@5.2.7/node_modules/vite/dist/node/index.js";
import commonjs from "file:///Users/Giovanni/Developer/API-2324/node_modules/.pnpm/@rollup+plugin-commonjs@25.0.7/node_modules/@rollup/plugin-commonjs/dist/es/index.js";
import path from "path";
var __vite_injected_original_dirname = "/Users/Giovanni/Developer/API-2324";
var vite_config_default = defineConfig({
  appType: "custom",
  base: "/",
  resolve: {
    alias: {
      "~": path.resolve(__vite_injected_original_dirname, "./src"),
      "~~": path.resolve(__vite_injected_original_dirname, "./"),
      "@": path.resolve(__vite_injected_original_dirname, "./server")
    }
  },
  plugins: [commonjs()],
  optimizeDeps: { exclude: ["fsevents"] },
  publicDir: "./public",
  hmr: {
    clientPort: 5173
  },
  preview: {
    port: 3e3
  },
  ssr: {
    target: "node"
  },
  server: {
    port: 5173,
    origin: "http://localhost:5173"
  },
  build: {
    outDir: "build",
    assetsDir: "assets",
    sourcemap: true,
    minify: true,
    manifest: true,
    ssrManifest: true,
    ssr: "./server/server.js",
    rollupOptions: {
      input: "./src/main.js"
    }
  },
  prerender: true
}, ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // vite config
    define: {
      __APP_ENV__: env.APP_ENV
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvR2lvdmFubmkvRGV2ZWxvcGVyL0FQSS0yMzI0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvR2lvdmFubmkvRGV2ZWxvcGVyL0FQSS0yMzI0L3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9HaW92YW5uaS9EZXZlbG9wZXIvQVBJLTIzMjQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCBjb21tb25qcyBmcm9tICdAcm9sbHVwL3BsdWdpbi1jb21tb25qcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGFwcFR5cGU6IFwiY3VzdG9tXCIsXG4gIGJhc2U6IFwiL1wiLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICd+JzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAnfn4nOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi8nKSxcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc2VydmVyJyksXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW2NvbW1vbmpzKCksXSxcbiAgb3B0aW1pemVEZXBzOiB7ZXhjbHVkZTogW1wiZnNldmVudHNcIl19LFxuICBwdWJsaWNEaXI6ICcuL3B1YmxpYycsXG4gIGhtcjoge1xuICAgIGNsaWVudFBvcnQ6IDUxNzNcbiAgfSxcbiAgcHJldmlldzoge1xuICAgIHBvcnQ6IDMwMDAsXG4gIH0sXG4gIHNzcjoge1xuICAgIHRhcmdldDogJ25vZGUnXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUxNzMsXG4gICAgb3JpZ2luOiAnaHR0cDovL2xvY2FsaG9zdDo1MTczJyxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdidWlsZCcsXG4gICAgYXNzZXRzRGlyOiAnYXNzZXRzJyxcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgbWluaWZ5OiB0cnVlLFxuICAgIG1hbmlmZXN0OiB0cnVlLFxuICAgIHNzck1hbmlmZXN0OiB0cnVlLFxuICAgIHNzcjogJy4vc2VydmVyL3NlcnZlci5qcycsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6ICcuL3NyYy9tYWluLmpzJyxcbiAgICB9XG4gIH0sXG4gIHByZXJlbmRlcjogdHJ1ZVxufSwoeyBjb21tYW5kLCBtb2RlIH0pID0+IHtcbiAgLy8gTG9hZCBlbnYgZmlsZSBiYXNlZCBvbiBgbW9kZWAgaW4gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuXG4gIC8vIFNldCB0aGUgdGhpcmQgcGFyYW1ldGVyIHRvICcnIHRvIGxvYWQgYWxsIGVudiByZWdhcmRsZXNzIG9mIHRoZSBgVklURV9gIHByZWZpeC5cbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJylcbiAgcmV0dXJuIHtcbiAgICAvLyB2aXRlIGNvbmZpZ1xuICAgIGRlZmluZToge1xuICAgICAgX19BUFBfRU5WX186IGVudi5BUFBfRU5WLFxuICAgIH0sXG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdSLFNBQVMsY0FBYyxlQUFlO0FBQzlULE9BQU8sY0FBYztBQUNyQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFHekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLEVBQ1QsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3BDLE1BQU0sS0FBSyxRQUFRLGtDQUFXLElBQUk7QUFBQSxNQUNsQyxLQUFLLEtBQUssUUFBUSxrQ0FBVyxVQUFVO0FBQUEsSUFDekM7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTLENBQUMsU0FBUyxDQUFFO0FBQUEsRUFDckIsY0FBYyxFQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUM7QUFBQSxFQUNwQyxXQUFXO0FBQUEsRUFDWCxLQUFLO0FBQUEsSUFDSCxZQUFZO0FBQUEsRUFDZDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBLElBQ1gsUUFBUTtBQUFBLElBQ1IsVUFBVTtBQUFBLElBQ1YsYUFBYTtBQUFBLElBQ2IsS0FBSztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLElBQ1Q7QUFBQSxFQUNGO0FBQUEsRUFDQSxXQUFXO0FBQ2IsR0FBRSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFHdkIsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBQzNDLFNBQU87QUFBQTtBQUFBLElBRUwsUUFBUTtBQUFBLE1BQ04sYUFBYSxJQUFJO0FBQUEsSUFDbkI7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
