import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
//引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// Element Plus 暗黑主题变量（切换 html.dark 时需要此文件完成全局暗黑）
import 'element-plus/theme-chalk/dark/css-vars.css'
//引入element-icons图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//element国际化配置。默认英语，但我们设置中文
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 导入SVG图标注册（必须引入才能使vite-plugin-svg-icons生效）
import 'virtual:svg-icons-register'
import './permisstion'
const app = createApp(App)

// 注册Element Plus图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用插件
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(createPinia())
app.use(router)

// 根据 localStorage 初始化暗黑模式（如果保存了 dark-mode=true）
try {
  const isDark = typeof localStorage !== 'undefined' && localStorage.getItem('dark-mode') === 'true'
  if (isDark) document.documentElement.classList.add('dark')
} catch (e) {
  // 非浏览器环境忽略
}
//引入自定义插件对象:注册整个项目全局组件
import globalComponent from '@/components'
//安装自定义插件
app.use(globalComponent)
//引入模板全局样式
import '@/styles/index.scss'
//引入路由鉴权

// 挂载应用
app.mount('#app')



