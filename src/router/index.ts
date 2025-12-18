//通过vue-router插件实现模板路由配置
import { createRouter, createWebHistory } from 'vue-router'
import { constantRoute, asnycRoute, anyRoute } from './routes'

// 定义路由类型
type RouteRecordRaw = {
  path: string
  component?: any
  name?: string
  meta?: {
    title: string
    hidden: boolean
    icon?: string
  }
  redirect?: string
  children?: RouteRecordRaw[]
}

// 创建路由器
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...constantRoute, ...asnycRoute, anyRoute],
  //滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    }
  }
})

// 重置路由的方法
export function resetRouter() {
  router.replace({ path: '/login' })
}

export default router
