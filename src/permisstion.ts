import router from "./router";
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import useUserStore from "./stores/modules/user";
nprogress.configure({ showSpinner: false });
router.beforeEach(async (to, from, next) => {
  // 在路由守卫内部获取store，确保Pinia已经初始化
  const userStore = useUserStore()
  const username = userStore.username
  nprogress.start()
  const token = userStore.token
  if (token) {
    // 已登录状态的处理
    if (to.path === '/login') {
      next({ path: '/home' })
    } else {
      if (username) {
        next()
      } else {
        try {
          await userStore.userInfo()
          next()
        } catch (error) {
          //这里相当于token过期
          userStore.userLogout()
          next({ path: '/login' })
        }
      }
    }

  } else {
    // 未登录状态的处理
    if (to.path === '/login') {
      next()
    } else {
      next({ path: '/login' })
    }
  }
})
router.afterEach((to, from) => {
  // 关闭进度条
  nprogress.done()
})
