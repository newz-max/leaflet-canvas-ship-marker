import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
    },
  },

  css: {
    /* CSS 预处理器 */
    preprocessorOptions: {
      scss: {
      },
    },
  },
});
