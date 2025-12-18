<template>
  <div class="logo-container">
    <img :src="setting.logo" alt="">
    <h1> {{ setting.title }}</h1>
  </div>
</template>

<script setup lang="ts">
// Logo组件
import setting from '@/setting'
import useLayOutSettingStore from '@/stores/setting'

const LayOutSettingStore = useLayOutSettingStore()
</script>

<style scoped lang="scss">
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;

  img {
    width: 30px;
    height: 30px;
    margin-left: -20px;
  }

  h1 {
    font-size: 18px;
    margin-left: 12px;
    color: white;

  }
}
</style>
