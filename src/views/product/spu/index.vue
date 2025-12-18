<template>
  <div class="spu-container">
    <!-- 分类选择组件 -->
    <Category :scene="scene" />

    <el-card class="spu-card" style="margin: 10px 0;">
      <!-- SPU列表场景 -->
      <div v-show="scene === 0">
        <div class="card-header">
          <el-button 
            @click="addSpu" 
            type="primary" 
            size="default" 
            :icon="Plus"
            :disabled="!categoryStore.c3Id"
          >
            添加SPU
          </el-button>
          
          <div class="header-info" v-if="categoryStore.c3Id">
            <el-tag type="info" size="small">
              当前分类：{{ categoryStore.categoryNames.c3Name || '未选择' }}
            </el-tag>
          </div>
        </div>

        <!-- 数据列表 -->
        <el-table 
          style="margin: 16px 0;" 
          border 
          :data="records"
          :loading="loading.list"
          :row-key="(row) => row.id"
          stripe
        >
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName" min-width="200px"></el-table-column>
          <el-table-column label="SPU描述" prop="description" show-overflow-tooltip min-width="300px"></el-table-column>
          <el-table-column label="操作" align="center" width="280px">
            <template #default="{ row }">
              <el-button 
                type="success" 
                size="small" 
                :icon="Plus" 
                title="添加SKU" 
                @click="addSku(row)"
              ></el-button>
              <el-button 
                type="primary" 
                size="small" 
                :icon="Edit" 
                title="修改SPU" 
                @click="updateSpu(row)"
              ></el-button>
              <el-button 
                type="info" 
                size="small" 
                :icon="View" 
                title="查看SKU列表" 
                @click="findSku(row)"
              ></el-button>
              <el-popconfirm 
                :title="`确定删除SPU：${row.spuName}?`" 
                width="280px" 
                confirm-button-text="确定删除" 
                cancel-button-text="取消"
                @confirm="deleteSpu(row)"
                confirm-button-type="danger"
              >
                <template #reference>
                  <el-button 
                    type="danger" 
                    size="small" 
                    :icon="Delete" 
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 空状态 -->
        <div v-if="!loading.list && records.length === 0" class="empty-state">
          <el-empty 
            description="暂无SPU数据"
            :image-size="100"
          >
            <el-button type="primary" @click="getHasSpu">重新加载</el-button>
          </el-empty>
        </div>

        <!-- 分页 -->
        <div v-if="total > 0" class="pagination-container">
          <el-pagination 
            v-model:current-page="pageNo" 
            v-model:page-size="pageSize" 
            :page-sizes="[10, 20, 30, 50]"
            :background="true" 
            layout="prev, pager, next, jumper,->,sizes,total" 
            :total="total"
            @current-change="getHasSpu" 
            @size-change="changeSize" 
          />
        </div>
      </div>

      <!-- 表单场景 -->
      <SpuForm ref="spu" v-show="scene === 1" @changeScene="changeScene" />
      <SkuForm ref="sku" v-show="scene === 2" @changeScene="changeScene" />
    </el-card>

    <!-- SKU列表弹窗 -->
    <el-dialog 
      v-model="show" 
      title="SKU列表" 
      width="80%"
      :close-on-click-modal="false"
    >
      <el-table 
        border 
        :data="skuArr"
        :loading="loading.skuList"
        stripe
      >
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="SKU名称" prop="skuName" min-width="200px"></el-table-column>
        <el-table-column label="SKU价格" prop="price" align="right" width="120px">
          <template #default="{ row }">
            ¥{{ row.price || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="SKU重量" prop="weight" align="right" width="120px">
          <template #default="{ row }">
            {{ row.weight || 0 }}g
          </template>
        </el-table-column>
        <el-table-column label="SKU图片" width="120px">
          <template #default="{ row }">
            <el-image 
              v-if="row.skuDefaultImg" 
              :src="row.skuDefaultImg" 
              fit="cover" 
              style="width: 80px; height: 80px;" 
              :preview-src-list="[row.skuDefaultImg]"
            />
            <div v-else class="empty-img">无图片</div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- SKU列表为空 -->
      <div v-if="!loading.skuList && skuArr.length === 0" class="empty-state">
        <el-empty description="暂无SKU数据" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, computed } from 'vue';
import { Plus, Edit, View, Delete } from '@element-plus/icons-vue';
import useCategoryStore from '@/stores/modules/category';
import SpuForm from './SpuForm.vue';
import SkuForm from './SkuForm.vue';
import { ElMessage, ElTag } from 'element-plus';
// 导入真实的API
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu';
// 导入类型
import type { SpuData, SkuInfoData } from '@/api/product/spu/type';

const categoryStore = useCategoryStore();

// 场景管理
const scene = ref<number>(0);

// 分页参数
const pageNo = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);

// 数据列表
const records = ref<SpuData[]>([]);
const skuArr = ref<SkuInfoData['data']>([]);

// 加载状态
const loading = ref({
  list: false,
  skuList: false,
  delete: false
});

// 弹窗控制
const show = ref<boolean>(false);

// 组件引用
const spu = ref<any>(null);
const sku = ref<any>(null);

// 监听分类变化
watch(() => categoryStore.c3ID, () => {
  if (categoryStore.c3ID) {
    getHasSpu();
  } else {
    // 清空列表
    records.value = [];
    total.value = 0;
  }
});

// 获取SPU列表
const getHasSpu = async (pager = 1) => {
  try {
    pageNo.value = pager;
    if (!categoryStore.c3ID) return;

    loading.list = true;
    
    const result = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3ID);
    
    if (result?.code === 200) {
      records.value = result.data.records || [];
      total.value = result.data.total || 0;
    } else {
      ElMessage({ type: 'error', message: '获取SPU列表失败' });
    }
  } catch (error: any) {
    console.error('获取SPU列表失败:', error);
    ElMessage({ type: 'error', message: error.message || '获取SPU列表失败' });
    records.value = [];
    total.value = 0;
  } finally {
    loading.list = false;
  }
};

// 分页大小变化
const changeSize = () => {
  getHasSpu(1);
};

// 添加SPU
const addSpu = () => {
  scene.value = 1;
  spu.value?.initAddSpu?.(categoryStore.c3ID);
};

// 修改SPU
const updateSpu = (row: SpuData) => {
  scene.value = 1;
  spu.value?.initHasSpuData?.(row);
};

// 切换场景
const changeScene = (obj: any) => {
  scene.value = obj.flag;
  if (obj.params === 'update') {
    getHasSpu(pageNo.value);
  } else {
    getHasSpu();
  }
};

// 添加SKU
const addSku = (row: SpuData) => {
  scene.value = 2;
  sku.value?.initSkuData?.(categoryStore.c1ID, categoryStore.c2ID, row);
};

// 获取SKU列表
const findSku = async (row: SpuData) => {
  try {
    loading.skuList = true;
    
    const result = await reqSkuList(row.id as number);
    
    if (result?.code === 200) {
      skuArr.value = result.data || [];
      show.value = true;
    } else {
      ElMessage({ type: 'error', message: '获取SKU列表失败' });
    }
  } catch (error: any) {
    console.error('获取SKU列表失败:', error);
    ElMessage({ type: 'error', message: error.message || '获取SKU列表失败' });
  } finally {
    loading.skuList = false;
  }
};

// 删除SPU
const deleteSpu = async (row: SpuData) => {
  try {
    loading.delete = true;
    
    const result = await reqRemoveSpu(row.id as number);
    
    if (result?.code === 200) {
      ElMessage({ type: 'success', message: '删除SPU成功' });
      // 刷新列表
      getHasSpu();
    } else {
      ElMessage({ type: 'error', message: '删除SPU失败' });
    }
  } catch (error: any) {
    console.error('删除SPU失败:', error);
    ElMessage({ type: 'error', message: error.message || '删除SPU失败' });
  } finally {
    loading.delete = false;
  }
};

// 组件卸载前重置分类
onBeforeUnmount(() => {
  categoryStore.$reset();
});
</script>

<style scoped>
.spu-container {
  padding: 10px;
}

.spu-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.header-info {
  display: flex;
  gap: 8px;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.empty-img {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  color: #909399;
  border-radius: 4px;
  font-size: 12px;
}
</style>
