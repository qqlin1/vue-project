<template>
  <div class="pagination-container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// 定义组件的props
const props = defineProps<{
  total: number
  pageSize?: number
  currentPage?: number
  pageSizes?: number[]
}>()

// 定义emit事件
const emit = defineEmits<{
  (e: 'size-change', pageSize: number): void
  (e: 'current-change', currentPage: number): void
}>()

// 使用ref来管理内部状态，默认值从props获取
const currentPage = ref(props.currentPage || 1)
const pageSize = ref(props.pageSize || 10)

// 监听props变化，同步到内部状态
watch(() => props.currentPage, (newVal) => {
  if (newVal !== undefined) {
    currentPage.value = newVal
  }
})

watch(() => props.pageSize, (newVal) => {
  if (newVal !== undefined) {
    pageSize.value = newVal
  }
})

// 处理页面大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  emit('size-change', size)
}

// 处理当前页码变化
const handleCurrentChange = (current: number) => {
  currentPage.value = current
  emit('current-change', current)
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px 0;
}
</style>