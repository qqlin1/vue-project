<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select style="width: 200px;" v-model="category.c1ID" @change="SelectChange1" :disabled="!!scene">
          <el-option v-for="c1 in category.c1ARR" :label="c1.name" :key="c1.id" :value="c1.id"></el-option>

        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select style="width: 200px;" v-model="category.c2ID" @change="SelectChange2" :disabled="!!scene">
          <el-option v-for="c2 in category.c2ARR" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select style="width: 200px;" v-model="category.c3ID" :disabled="!!scene">
          <el-option v-for="c3 in category.c3ARR" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>

    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import useCategoryStore from '@/stores/modules/category';
import { Select } from '@element-plus/icons-vue';
const category = useCategoryStore()
import { onMounted } from 'vue';
const props = defineProps(['scene'])
const { scene } = props
onMounted(() => {
  getc1()
})
const getc1 = () => {

  category.GETC1()
}
const SelectChange1 = () => {
  category.c2ARR = []
  category.c2ID = null
  category.c3ARR = []
  category.c3ID = null
  category.GETC2()
}
const SelectChange2 = () => {
  category.c3ARR = []
  category.c3ID = null
  category.GETC3()
}

</script>

<style scoped></style>
