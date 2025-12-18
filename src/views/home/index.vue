<template>
  <div>
    <!-- 顶部用户信息卡片 -->
    <el-card style="margin-bottom: 20px;">
      <div class="box">
        <!-- 左侧头像 -->
        <img :src="userStore.avatar" alt="avatar" class="avatar" />
        <!-- 文本信息 -->
        <div class="bottom">
          <h3 class="title">
            {{ getHour() }}好 {{ userStore.username }}
          </h3>
          <p class="subtitle">硅谷甄选运营平台</p>
        </div>
      </div>
    </el-card>

    <!-- 底部的欢迎矢量插图 -->
    <div class="bg-image">
      <svg-icon name="welcome" width="500px" height="400px"></svg-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入用户仓库（用来获取头像和用户名）
import useUserStore from '@/stores/modules/user'
// 引入获取时间的工具函数
import { getHour } from '@/utils/getHour'

const userStore = useUserStore()
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center; // 垂直居中

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%; // 圆形头像
    margin-right: 20px; // 图文间距
  }

  .bottom {
    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 10px;
      /* 使用 Element Plus 的主题变量，以支持暗黑模式 */
      color: var(--el-text-color-primary);
    }

    .subtitle {
      font-style: italic; // 斜体
      /* 主题色或次级文本颜色，暗黑模式下会更合适 */
      color: var(--el-color-primary);
      font-weight: 700;
    }
  }
}

.bg-image {
  margin-top: 30px; // 距离上方卡片的间距
  display: flex;
  justify-content: center; // 水平居中
  align-items: center;

  // 如果用 img 标签，可以加这个样式
  img {
    width: 60%;
    max-width: 800px;
  }
}
</style>
