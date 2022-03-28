import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    minify: "terser",
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "leaflet-canvas-ship-marker",
      rollupOptions: {
        external: ["html"],
      },
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
    },
    css: {
      /* CSS 预处理器 */
      preprocessorOptions: {
        scss: {},
      },
    },
  },
});
