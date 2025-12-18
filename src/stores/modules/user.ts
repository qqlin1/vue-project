import { reqLogin, reqLogout, reqUserInfo } from "@/api/user"
import { defineStore } from "pinia"
import type { LoginParams, LoginResponse } from "@/api/user/type"
import { constantRoute, asnycRoute } from '@/router/routes'
import { errorMessages } from "vue/compiler-sfc"
// User Store的State类型定义
interface UserState {
  token: string,
  menuRoutes: any[],
  username: string,
  avatar: string
}

// User Store的完整类型定义
interface UserStore extends UserState {
  userLogin(data: LoginParams): Promise<void>
  userInfo(): Promise<void>
  userLogout(): Promise<void>
}

const useUserStore = defineStore<'User', UserState, {}, { userLogin(data: LoginParams): Promise<void>; userInfo(): Promise<void>; userLogout(): Promise<void> }>('User', {
  state: (): UserState => {
    return {
      token: localStorage.getItem('TOKEN') || '',
      menuRoutes: [...constantRoute, ...asnycRoute],
      username: '',
      avatar: ''
    }
  },

  actions: {
    async userLogin(data: LoginParams): Promise<void> {
      try {
        // reqLogin返回的是AxiosResponse，需要从data属性获取实际响应数据
        const response = await reqLogin(data)
        // 假设reqLogin已经正确返回了LoginResponse格式
        const result: LoginResponse = response

        if (result.code === 200 && result.data) {
          // 后端直接返回token字符串，而不是包含token的对象
          this.token = result.data
          localStorage.setItem('TOKEN', result.data)
        } else {
          // 根据mock返回的结构，错误信息在result.message中
          const errorMessage = result?.message || '登录失败'
          return Promise.reject(new Error(errorMessage))
        }
      } catch (error) {
        console.error('登录请求失败:', error)
        return Promise.reject(error instanceof Error ? error : new Error('登录请求异常'))
      }
    },
    async userInfo() {
      try {
        const result = await reqUserInfo()
        if (result.code == 200) {
          this.username = result.data.username
          this.avatar = result.data.avatar
        } else {
          const errorMessages = result?.message || '获取信息失败'
          return Promise.reject(new Error(errorMessages))
        }
      } catch (error) {
        console.error('获取信息失败请求失败:', error)
        return Promise.reject(error instanceof Error ? error : new Error('获取信息失败请求失败'))
      }
    },
    async userLogout() {
      try {
        const result = await reqLogout()
        if (result.code == 200) {
          this.username = ''
          this.avatar = ''
          this.token = ''
          localStorage.removeItem('TOKEN')
        } else {
          const errorMessages = result?.message || '退出失败'
          return Promise.reject(new Error(errorMessages))
        }
      } catch (error) {
        console.error('退出失败:', error)
        return Promise.reject(error instanceof Error ? error : new Error('退出失败'))
      }
    },

  },

  getters: {
    // 可以添加getter，例如检查是否已登录
    isLoggedIn: (state): boolean => {
      return !!state.token
    }
  }
})

export default useUserStore
// 导出store类型以便在组件中使用
export type { UserStore }
