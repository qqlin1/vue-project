<template>
  <div class="sku-form-container">
    <el-card class="sku-form-card">
      <template #header>
        <div class="card-header">
          <span>添加SKU</span>
        </div>
      </template>
      
      <el-form label-width="120px" :model="skuParams" ref="formRef" size="default">
        <!-- 基本信息 -->
        <div class="form-section">
          <h3 class="section-title">基本信息</h3>
          
          <el-form-item label="SKU名称" prop="skuName">
            <el-input 
              placeholder="请输入SKU名称" 
              v-model="skuParams.skuName" 
              maxlength="50" 
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="SKU描述" prop="skuDesc">
            <el-input 
              placeholder="请输入SKU描述" 
              type="textarea" 
              v-model="skuParams.skuDesc"
              rows="3"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
        </div>
        
        <!-- 价格与重量 -->
        <div class="form-section">
          <h3 class="section-title">价格与重量</h3>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="价格(元)" prop="price">
                <el-input 
                  placeholder="请输入价格(元)" 
                  type="number" 
                  v-model="skuParams.price"
                  :min="0"
                  :precision="2"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="重量(g)" prop="weight">
                <el-input 
                  placeholder="请输入重量(g)" 
                  type="number" 
                  v-model="skuParams.weight"
                  :min="0"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        
        <!-- 平台属性 -->
        <div class="form-section">
          <h3 class="section-title">平台属性</h3>
          
          <el-form :inline="true" size="small">
            <el-form-item 
              v-for="(item, index) in attrArr" 
              :key="item.id" 
              :label="item.attrName"
            >
              <el-select 
                v-model="item.attrIdAndValueId" 
                placeholder="请选择"
                :disabled="loading.attr"
              >
                <el-option 
                  :value="`${item.id}:${attrValue.id}`" 
                  v-for="(attrValue, index) in item.attrValueList" 
                  :key="attrValue.id" 
                  :label="attrValue.valueName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        
        <!-- 销售属性 -->
        <div class="form-section">
          <h3 class="section-title">销售属性</h3>
          
          <el-form :inline="true" size="small">
            <el-form-item 
              :label="item.saleAttrName" 
              v-for="(item, index) in saleArr" 
              :key="item.id"
            >
              <el-select 
                v-model="item.saleIdAndValueId" 
                placeholder="请选择"
                :disabled="loading.sale"
              >
                <el-option 
                  :value="`${item.id}:${saleAttrValue.id}`" 
                  v-for="(saleAttrValue, index) in item.spuSaleAttrValueList" 
                  :key="saleAttrValue.id" 
                  :label="saleAttrValue.saleAttrValueName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        
        <!-- 图片选择 -->
        <div class="form-section">
          <h3 class="section-title">图片设置</h3>
          
          <el-form-item label="选择默认图片">
            <el-table 
              border 
              :data="imgArr" 
              ref="table" 
              :loading="loading.img"
              style="width: 100%"
            >
              <el-table-column type="selection" width="80px" align="center"></el-table-column>
              <el-table-column label="图片预览">
                <template #default="{ row }">
                  <el-image 
                    :src="row.imgUrl" 
                    fit="cover" 
                    style="width:100px;height: 100px;"
                    :preview-src-list="[row.imgUrl]"
                  />
                </template>
              </el-table-column>
              <el-table-column label="图片名称" prop="imgName"></el-table-column>
              <el-table-column label="操作" width="120px" align="center">
                <template #default="{ row }">
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="setDefaultImage(row)"
                    :loading="loading.setDefault"
                  >
                    设置默认
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <div v-if="imgArr.length === 0" class="empty-tip">
              <el-empty description="暂无图片，请先上传图片" />
            </div>
          </el-form-item>
        </div>
        
        <!-- 操作按钮 -->
        <div class="form-section">
          <el-form-item>
            <el-button 
              type="primary" 
              size="default" 
              @click="save" 
              :loading="loading.save"
            >
              保存SKU
            </el-button>
            <el-button size="default" @click="cancel">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { reqAttrInfoList as reqAttr } from '@/api/product/attr';
import { reqSpuImageList, reqSpuHasSaleAttr, reqAddSku } from '@/api/product/spu';
import type { SkuData } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus';

const $emit = defineEmits(['changeScene']);
const formRef = ref<any>(null);

// 加载状态管理
const loading = reactive({
  attr: false,
  sale: false,
  img: false,
  setDefault: false,
  save: false
});

// 数据列表
const attrArr = ref<any[]>([]);
const saleArr = ref<any[]>([]);
const imgArr = ref<any[]>([]);
const table = ref<any>(null);

// SKU参数
const skuParams = reactive<SkuData>({
  category3Id: '',
  spuId: '',
  tmId: '',
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '',
});

// 初始化SKU数据
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
  // 设置基础信息
  skuParams.category3Id = spu.category3Id;
  skuParams.spuId = spu.id;
  skuParams.tmId = spu.tmId;
  
  // 重置其他字段
  skuParams.skuName = '';
  skuParams.price = '';
  skuParams.weight = '';
  skuParams.skuDesc = '';
  skuParams.skuDefaultImg = '';
  skuParams.skuAttrValueList = [];
  skuParams.skuSaleAttrValueList = [];
  
  // 加载数据
  try {
    loading.attr = true;
    loading.sale = true;
    loading.img = true;
    
    // 并行请求数据，提高性能
    const [attrResult, saleResult, imgResult] = await Promise.all([
      reqAttr(Number(c1Id), Number(c2Id), Number(spu.category3Id)),
      reqSpuHasSaleAttr(spu.id),
      reqSpuImageList(spu.id)
    ]);
    
    // 处理返回数据
    attrArr.value = attrResult.data || [];
    saleArr.value = saleResult.data || [];
    imgArr.value = imgResult.data || [];
    
    // 为属性添加idAndValueId字段
    attrArr.value.forEach(item => {
      item.attrIdAndValueId = '';
    });
    
    // 为销售属性添加idAndValueId字段
    saleArr.value.forEach(item => {
      item.saleIdAndValueId = '';
    });
    
  } catch (error: any) {
    console.error('初始化SKU数据失败:', error);
    ElMessage.error('初始化SKU数据失败，请稍后重试');
  } finally {
    loading.attr = false;
    loading.sale = false;
    loading.img = false;
  }
};

// 取消操作
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' });
};

// 设置默认图片
const setDefaultImage = (row: any) => {
  loading.setDefault = true;
  
  // 取消所有选择
  imgArr.value.forEach((item: any) => {
    table.value?.toggleRowSelection(item, false);
  });
  
  // 选中当前行
  table.value?.toggleRowSelection(row, true);
  
  // 设置默认图片
  skuParams.skuDefaultImg = row.imgUrl;
  
  loading.setDefault = false;
};

// 保存SKU
const save = async () => {
  // 表单验证
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
  } catch (error) {
    ElMessage.warning('请完善SKU信息');
    return;
  }
  
  // 检查图片选择
  if (!skuParams.skuDefaultImg) {
    ElMessage.warning('请选择默认图片');
    return;
  }
  
  // 构建平台属性列表
  skuParams.skuAttrValueList = attrArr.value
    .filter(item => item.attrIdAndValueId)
    .map(item => {
      const [attrId, valueId] = item.attrIdAndValueId.split(':');
      return {
        attrId,
        valueId
      };
    });
  
  // 构建销售属性列表
  skuParams.skuSaleAttrValueList = saleArr.value
    .filter(item => item.saleIdAndValueId)
    .map(item => {
      const [saleAttrId, saleAttrValueId] = item.saleIdAndValueId.split(':');
      return {
        saleAttrId,
        saleAttrValueId
      };
    });
  
  // 检查属性是否完整
  if (skuParams.skuAttrValueList.length === 0) {
    ElMessage.warning('请选择平台属性');
    return;
  }
  
  if (skuParams.skuSaleAttrValueList.length === 0) {
    ElMessage.warning('请选择销售属性');
    return;
  }
  
  // 保存SKU
  loading.save = true;
  
  try {
    const result = await reqAddSku(skuParams);
    
    if (result.code === 200) {
      ElMessage.success('SKU添加成功');
      $emit('changeScene', { flag: 0, params: 'addSku' });
    } else {
      ElMessage.error(result.message || '添加SKU失败');
    }
  } catch (error: any) {
    console.error('保存SKU失败:', error);
    ElMessage.error(error.message || '保存SKU失败，请稍后重试');
  } finally {
    loading.save = false;
  }
};

defineExpose({
  initSkuData
});
</script>

<style scoped>
.sku-form-container {
  padding: 20px;
}

.sku-form-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  font-weight: bold;
  font-size: 16px;
}

.form-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 16px;
  padding-left: 4px;
  border-left: 3px solid #409eff;
}

.empty-tip {
  margin: 20px 0;
  text-align: center;
}
</style>
