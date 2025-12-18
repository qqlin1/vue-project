import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// import { viteMockServe } from 'vite-plugin-mock'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // 简化symbolId格式，直接使用图标名称
      symbolId: 'icon-[name]',
    })
    // ,
    // viteMockServe({
    //   // mock文件目录
    //   mockPath: 'mock',
    //   // 监视mock文件变化
    //   watchFiles: true,
    //   // 禁用 mock，使用真实 API
    //   localEnabled: false,
    //   prodEnabled: false,
    //   injectCode: `
    //     import { UserConfigExport, ConfigEnv } from 'vite'
    //     export default function mockDevServerPlugin(): UserConfigExport {
    //       return {}
    //     }
    //   `
    // })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variable.scss";',
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:10086',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }

})
