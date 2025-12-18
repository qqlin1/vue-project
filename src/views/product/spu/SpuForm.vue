<template>
  <div class="spu-form-container">
    <el-card class="spu-form-card">
      <template #header>
        <div class="card-header">
          <span>{{ form.id ? '修改SPU' : '添加SPU' }}</span>
        </div>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" size="default">
        <el-form-item label="SPU 名称" prop="spuName">
          <el-input v-model="form.spuName" placeholder="请输入SPU名称" maxlength="50" show-word-limit />
        </el-form-item>
        
        <el-form-item label="品牌" prop="tmId">
          <el-select v-model="form.tmId" placeholder="请选择品牌" :loading="loading.brands">
            <el-option v-for="b in brands" :key="b.id" :label="b.tmName" :value="b.id" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="SPU描述" prop="description">
          <el-input 
            type="textarea" 
            v-model="form.description" 
            placeholder="请输入SPU描述" 
            :rows="4" 
            maxlength="200" 
            show-word-limit 
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="save" 
            :loading="loading.save"
            size="default"
          >
            {{ form.id ? '更新SPU' : '保存SPU' }}
          </el-button>
          <el-button @click="cancel" size="default">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { reqAllTradeMark, reqAddOrUpdateSpu } from '@/api/product/spu'
import type { SpuData, Trademark } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus';

const $emit = defineEmits(['changeScene']);
const formRef = ref<any>(null);

// 加载状态
const loading = reactive({
  brands: false,
  save: false
});

// 表单验证规则
const rules = reactive({
  spuName: [
    { required: true, message: '请输入SPU名称', trigger: 'blur' },
    { min: 2, max: 50, message: 'SPU名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  tmId: [
    { required: true, message: '请选择品牌', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入SPU描述', trigger: 'blur' },
    { min: 10, max: 200, message: 'SPU描述长度在 10 到 200 个字符', trigger: 'blur' }
  ]
});

const brands = ref<Trademark[]>([]);
const form = ref<Partial<SpuData>>({ category3Id: '', spuName: '', description: '', tmId: '' });

const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' });
};

const fetchBrands = async () => {
  loading.brands = true;
  try {
    const res = await reqAllTradeMark();
    if (res?.code === 200) {
      brands.value = res.data;
    } else {
      ElMessage.error('获取品牌列表失败');
    }
  } catch (error) {
    console.error('获取品牌列表失败:', error);
    ElMessage.error('获取品牌列表失败');
  } finally {
    loading.brands = false;
  }
};

const initHasSpuData = async (spu: SpuData) => {
  form.value = { ...spu };
  await fetchBrands();
};

const initAddSpu = async (c3Id: number | string) => {
  form.value = { category3Id: c3Id as any, spuName: '', description: '', tmId: '' };
  await fetchBrands();
};

const save = async () => {
  // 表单验证
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
  } catch (error) {
    ElMessage.warning('请完善表单信息');
    return;
  }
  
  loading.save = true;
  
  try {
    const payload = form.value as SpuData;
    const result = await reqAddOrUpdateSpu(payload);
    
    if (result.code === 200) {
      ElMessage.success(payload.id ? 'SPU更新成功' : 'SPU添加成功');
      $emit('changeScene', { flag: 0, params: payload.id ? 'update' : 'add' });
    } else {
      ElMessage.error(result.message || '操作失败');
    }
  } catch (error: any) {
    console.error('保存SPU失败:', error);
    ElMessage.error(error.message || '保存SPU失败，请稍后重试');
  } finally {
    loading.save = false;
  }
};

defineExpose({ initHasSpuData, initAddSpu });
</script>

<style scoped>
.spu-form-container {
  padding: 20px;
}

.spu-form-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
}
</style>
