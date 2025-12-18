import { defineStore } from "pinia";
import { reqC1, reqC2, reqC3 } from '@/api/product/attr/index'
const useCategoryStore = defineStore('category', {

  state: () => {
    return {
      c1ARR: [],
      c1ID: null,
      c2ARR: [],
      c2ID: null,
      c3ARR: [],
      c3ID: null
      // 移除不再使用的attrInfoList，避免不必要的状态管理
    }
  },
  actions: {
    async GETC1() {
      const result = await reqC1()
      if (result.code === 200) {
        this.c1ARR = result.data
      }
    },
    async GETC2() {
      const result = await reqC2(this.c1ID)
      if (result.code === 200) {
        this.c2ARR = result.data
      }
    },
    async GETC3() {
      const result = await reqC3(this.c2ID)
      if (result.code === 200) {
        this.c3ARR = result.data
      }
    }
  }

})
export default useCategoryStore
