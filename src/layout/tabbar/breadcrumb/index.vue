<template>
  <div class="breadcrumb">
    <!-- 面包屑导航 -->
    <el-button style="margin-right: 10px;"><el-icon @click="changeMod">
        <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
      </el-icon></el-button>
    <el-breadcrumb :separator-icon="ArrowRight">
      <template v-for="(item, index) in breadcrumbList" :key="index">
        <el-breadcrumb-item v-if="index === breadcrumbList.length - 1">{{ item.meta.title }}</el-breadcrumb-item>
        <el-breadcrumb-item v-else :to="{ path: item.path }">{{ item.meta.title }}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
// 简化的breadcrumb组件
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowRight, Fold, Expand } from '@element-plus/icons-vue';
import useLayOutSettingStore from '@/stores/setting';

const route = useRoute();
const LayOutSettingStore = useLayOutSettingStore();

// 计算当前路由的面包屑列表
const breadcrumbList = computed(() => {
  const matched = route.matched;
  // 过滤掉首页路由，因为已经单独显示
  return matched.filter(item => item.path !== '/' && item.path !== '');
});

// 监听路由变化，可以在这里添加额外的处理逻辑
watch(() => route.path, () => {
  // 路由变化时可以进行的操作
  console.log('路由变化:', route.path);
});

const changeMod = () => {
  LayOutSettingStore.fold = !LayOutSettingStore.fold;
};
</script>

<script lang="ts">
export default {
  name: "Breadcrumb"
}
</script>

<style scoped>
.breadcrumb {
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
