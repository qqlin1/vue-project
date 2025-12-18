<template>
  <div class="tabs-wrapper">
    <!-- 标签栏内容 -->
    <breadcrumb></breadcrumb>
    <setting></setting>
  </div>
</template>

<script setup lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue';
import breadcrumb from './breadcrumb/index.vue'
import setting from './setting/index.vue'
// Tabbar组件脚本部分
</script>

<style scoped>
.tabs-wrapper {
  height: 100%;
  width: 100%;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 移除了固定定位，让组件自然适应父容器 */
</style>
