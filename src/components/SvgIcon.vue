<template>
  <!-- svg:图标外层容器节点,内部需要与use标签结合使用 -->
  <!-- 在HTML中引入sprite.svg -->
  
  
  <svg :style="{width,height}">
<!-- href执行用哪一个图标,属性值务必#icon-图标名字 -->
<!-- use标签fi11属性可以设置图标的颜色 -->
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts">

// 简化props，只保留必要的默认值
defineProps({
  //xlink:href属性值前缀
  prefix:{
    type:String,
    default:'#icon-'
  },
  //接收父组件传来的name
  name:String,
  color:{
    type:String,
    default:'red'},
    //接收父组件传来的width
  width:{
    type:String,
    default:'20px'},
    //接收父组件传来的height
  height:{
    type:String,
    default:'20px'}
    
});
</script>

<style scoped>

</style>