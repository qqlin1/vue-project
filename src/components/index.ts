//引入项目中全部的全局组件
import SvgIcon from "./SvgIcon.vue"
import test from "./test.vue"
import type { App } from 'vue'
import Pagination from "./Pagination.vue"
import Category from './Category/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 定义组件类型
const globalComponent = { SvgIcon, test, Pagination, Category }

export default {
  install(app: App) {
    Object.keys(globalComponent).forEach((e) => {
      // 使用类型断言确保类型安全
      app.component(e, globalComponent[e as keyof typeof globalComponent])
    })
    // Element Plus图标已在main.ts中注册，这里不再重复注册
  }
}
