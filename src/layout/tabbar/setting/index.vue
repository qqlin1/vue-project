<template>
  <div class="setting-container">
    <el-button @click="clickRefresh"><el-icon>
        <Refresh />
      </el-icon></el-button>
    <el-button @click="clickFullScreen"><el-icon>
        <FullScreen />
      </el-icon></el-button>
    <!-- 设置：弹窗包含主题颜色与暗黑切换 -->
    <el-popover placement="bottom" title="主题设置" :width="320" trigger="click">
      <el-form label-width="90px" style="padding: 6px 0;">
        <el-form-item label="主题颜色">
          <el-color-picker v-model="color" size="small" show-alpha :predefine="predefineColors" @change="setColor" />
        </el-form-item>
        <el-form-item label="暗黑模式">
          <el-switch v-model="isDark" inline-prompt active-icon="Moon" inactive-icon="Sunny" />
        </el-form-item>
      </el-form>

      <template #reference>
        <el-button size="small" circle icon="Setting"></el-button>
      </template>
    </el-popover>
    <div class="avatar"><img :src="userStore.avatar" alt="" style="width: 20px;
      height: 20px;"></div>

    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
      @select="handleSelect">
      <el-sub-menu index="2">
        <template #title>{{ userStore.username }}</template>
        <el-menu-item index="2-1" @click="logout">退出登录</el-menu-item>
      </el-sub-menu>
    </el-menu>

  </div>
</template>

<script setup lang="ts">
import { Refresh, FullScreen } from '@element-plus/icons-vue';
import { ref, onMounted } from 'vue';
import { useDark } from '@vueuse/core'
import useLayOutSettingStore from '@/stores/setting';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import useUserStore from '@/stores/modules/user';
const userStore = useUserStore()
const LayOutSettingStore = useLayOutSettingStore()
const router = useRouter()
const route = useRoute()
// 定义默认激活的菜单项
const activeIndex = ref('2');

// 定义选择菜单项的处理函数
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const clickRefresh = () => {
  LayOutSettingStore.refsh = !LayOutSettingStore.refsh
}
const clickFullScreen = () => {
  const full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
const logout = () => {
  userStore.userLogout()
  router.push({ path: '/login', query: { redirect: route.path } })
}

// -------------- 主题与暗黑模式（本地控制） --------------
const color = ref<string>('rgba(255, 69, 0, 0.68)')
// useDark 会自动管理 html 上的 class（dark）并持久化到 localStorage
const isDark = useDark({ selector: 'html', attribute: 'class', valueDark: 'dark', storageKey: 'dark-mode' })
// useToggle 可用于在需要时切换 isDark（这里不再显式使用）
const predefineColors = ref<string[]>([
  '#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585',
])

const setColor = (v?: string) => {
  const val = v ?? color.value
  try {
    document.documentElement.style.setProperty('--el-color-primary', val)
    // 保存用户选择
    if (typeof localStorage !== 'undefined') localStorage.setItem('theme-color', val)
  } catch (e) { }
}

// 不再需要手动添加/移除 class，useDark 自动处理

onMounted(() => {
  try {
    // 读取主题颜色
    // 读取主题颜色
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('theme-color') : null
    if (saved) {
      color.value = saved
      setColor(saved)
    }
  } catch (e) {
    // ignore
  }
})
</script>

<script lang="ts">
export default {
  name: "TabBarSetting"
}
</script>
<style scoped lang="scss">
.setting-container {
  .avatar {
    margin-left: 10px;
  }

  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;

}
</style>
