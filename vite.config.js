import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import path  from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS()
  ],
  resolve: {
    alias: {
      // 配置别名
      "@": path.resolve(__dirname, "./src")
    }
  },
  //  配置代理
  server: {
    open: true, // 自动启动浏览器
    host: "127.0.0.1", // localhost
    port: 5173, // 端口号
    https: false,
    // 代理
    proxy:{
      //将/api开头的url
      '/api':{
        //用这个url代替
        target:'http://ceshi13.dishait.cn',
        changeOrigin:true,
        //并将/api清空
        rewrite:(path) => path.replace(/^\/api/,'')
      }
    }
  },
  //less使用
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/assets/css/style.less')]
    }
  },
})