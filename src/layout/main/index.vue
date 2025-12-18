<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from 'vue'
import useLayOutSettingStore from '@/stores/setting';
const flag = ref(true)
const LayOutSettingStore = useLayOutSettingStore()
watch(() => LayOutSettingStore.refsh, () => {
  flag.value = false;
  setTimeout(() => {
    nextTick(() => {
      flag.value = true
    })
  }, 10);
})
</script>

<style scoped></style>
