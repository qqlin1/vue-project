<template>
  <div class="container">
    <!-- 左侧菜单 -->
    <div class="slider">
      <Logo></Logo>
      <el-scrollbar class="scrollbar">
        <el-menu background-color="#001529" text-color="white" :default-active="$route.path" unique-opened
          :collapse="LayOutSettingStore.fold ? true : false">
          <!-- 递归菜单组件 -->
          <Menu :menuList="menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="top" :class="{ fold: LayOutSettingStore.fold ? true : false }">
      <Tabbar></Tabbar>
    </div>

    <!-- 内容展示 -->
    <div class="main" :class="{ fold: LayOutSettingStore.fold ? true : false }">
      <Main></Main>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import Logo from './logo/index.vue';
import Menu from './menu/index.vue';
import Main from './main/index.vue';
import Tabbar from './tabbar/index.vue';
import useUserStore from '@/stores/modules/user';
import useLayOutSettingStore from '@/stores/setting';
// 获取user store
const userStore = useUserStore();
const LayOutSettingStore = useLayOutSettingStore()
// 直接从store中获取menuRoutes，确保响应式
const menuRoutes = computed(() => userStore.menuRoutes);
</script>
<script lang="ts">
export default {
  name: "Layout"
}
</script>
<style scoped lang="scss">
.container {
  position: relative;
  display: flex;
  height: 100vh;
  width: 100%;

  .slider {
    width: 240px;
    height: 100vh;
    background-color: #001529;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1;

    &.fold {
      width: 60px;
    }
  }

  .scrollbar {
    height: calc(100% - 60px);
  }

  .top {
    position: fixed;
    left: 240px;
    top: 0;
    right: 0;
    height: 60px;
    background-color: var(--el-bg-color);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1;
    color: var(--el-text-color-primary);

    &.fold {
      left: 60px;
      transition: all 0.5s;
    }
  }

  .main {
    position: absolute;
    width: calc(100% - 240px);
    left: 240px;
    top: 60px;
    /* 顶部导航栏60px */
    padding: 20px;
    min-height: calc(100vh - 60px);
    box-sizing: border-box;
    background-color: var(--el-bg-color-page);
    z-index: 10;

    &.fold {
      width: calc(100vw - 60px);
      left: 60px;
      transition: all 0.5s;
    }

  }
}
</style>
