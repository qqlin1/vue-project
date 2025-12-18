import { defineStore } from 'pinia'

// 定义选中状态的类型
interface SelectionState {
  // 用户管理选中状态
  userSelection: number[] // 保存选中的用户ID
  // 其他模块的选中状态可以在这里扩展
  // roleSelection: number[]
  // permissionSelection: number[]
}

export const useSelectionStore = defineStore('selection', {
  state: (): SelectionState => ({
    // 初始状态为空数组
    userSelection: [],
  }),

  getters: {
    // 获取用户选中数量
    userSelectionCount: (state) => state.userSelection.length,

    // 判断用户是否被选中
    isUserSelected: (state) => (id: number) => {
      return state.userSelection.includes(id)
    },
  },

  actions: {
    // 保存用户选中状态
    saveUserSelection(ids: number[]) {
      this.userSelection = ids
    },

    // 添加单个用户到选中列表
    addUserSelection(id: number) {
      if (!this.userSelection.includes(id)) {
        this.userSelection.push(id)
      }
    },

    // 从选中列表中移除单个用户
    removeUserSelection(id: number) {
      const index = this.userSelection.indexOf(id)
      if (index > -1) {
        this.userSelection.splice(index, 1)
      }
    },

    // 清空用户选中状态
    clearUserSelection() {
      this.userSelection = []
    },
  },
})
