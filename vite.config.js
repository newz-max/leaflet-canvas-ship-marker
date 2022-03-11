import { defineConfig } from 'vite'
import { resolve } from 'path' // 主要用于alias文件路径别名
import { terser } from 'rollup-plugin-terser'
 
export default defineConfig({
  // 打包配置
  build: {
    lib: {
      entry: resolve(__dirname, 'main.js'), // 设置入口文件
      name: 'leaflet-canvas-ship-marker', // 起个名字，安装、引入用
      fileName: (format) => `leaflet-canvas-ship-marker.${format}.js` // 打包后的文件名
    },
    sourcemap: true, // 输出.map文件
  },

  alias : {
    '@' : resolve(__dirname , 'src')
  },
  
  plugins:[
    terser()
  ]
})

