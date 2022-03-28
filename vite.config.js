import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build:{
    lib : {
      entry : path.resolve(__dirname , 'src/index.js'),
      name : 'leaflet-canvas-ship-marker',
      rollupOptions : {
        external : ['html']
      }
    }
  },
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
    },
  },
  
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
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
