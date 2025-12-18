<template>
  <el-card>
    <el-table border style="margin: 10px 0px;" :data="skuArr">
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="150px" prop="skuName"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip width="150px" prop="skuDesc"></el-table-column>
      <el-table-column label="图片" width="150px">
        <template #="{ row, $index }">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="重量" width="150px" prop="weight"></el-table-column>
      <el-table-column label="价格" width="150px" prop="price"></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateSale(row)"></el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateSku"></el-button>
          <el-button type="primary" size="small" icon="InfoFilled" @click="findSku(row)"></el-button>
          <el-popconfirm :title="`你确定要删除${row.skuName}?`" width="200px" @confirm="removeSku(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
      :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasSku"
      @size-change="handler" />
    <!-- 抽屉组件:展示商品详情 -->
    <el-drawer v-model="drawer">
      <!-- 标题部分 -->
      <template #header>
        <h4>查看商品的详情</h4>
      </template>
      <template #default>
        <el-row style="margin:10px 0px;">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin:10px 0px;">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin:10px 0px;">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin:10px 0px;">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag style="margin:5px;" v-for="item in skuInfo.skuAttrValueList" :key="item.id">{{
              item.valueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin:10px 0px;">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag style="margin:5px;" v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id">{{
              item.saleAttrValueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin:10px 0px;">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" alt="" style="width:100%;height: 100%;">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
// 导入真实的API
import { reqSkuList, reqSaleSku, reqCancelSale, reqSkuInfo, reqRemoveSku } from '../../../api/product/sku';
// 导入类型
import type { SkuResponseData, SkuInfoData } from '../../../api/product/sku/type';

// 分页与数据
const pageNo = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);

const skuArr = ref<SkuResponseData['data']['records']>([]);
//控制抽屉显示与隐藏的字段
const drawer = ref(false);
const skuInfo = ref<SkuInfoData['data']>({} as SkuInfoData['data']);

onMounted(() => {
  getHasSku();
});

// 调用真实API获取SKU列表
const getHasSku = async (pager = 1) => {
  try {
    pageNo.value = pager;
    const result = await reqSkuList(pageNo.value, pageSize.value);
    if (result.code === 200) {
      skuArr.value = result.data.records || [];
      total.value = result.data.total || 0;
    }
  } catch (error) {
    console.error('获取SKU列表失败:', error);
    ElMessage({ type: 'error', message: '获取SKU列表失败' });
  }
}

//分页器下拉菜单发生变化触发
const handler = (pageSizes: number) => {
  pageSize.value = pageSizes;
  getHasSku(pageNo.value);
}

//商品的上架与下架的操作
const updateSale = async (row: any) => {
  try {
    let result;
    if (row.isSale == 1) {
      // 下架操作
      result = await reqCancelSale(row.id);
    } else {
      // 上架操作
      result = await reqSaleSku(row.id);
    }
    
    if (result.code === 200) {
      ElMessage({ type: 'success', message: row.isSale == 1 ? '下架成功' : '上架成功' });
      // 重新获取数据
      getHasSku(pageNo.value);
    }
  } catch (error) {
    console.error('更新商品状态失败:', error);
    ElMessage({ type: 'error', message: '更新商品状态失败' });
  }
}

//更新已有的SKU（演示）
const updateSku = () => {
  ElMessage({ type: 'success', message: '编辑 SKU' });
}

//查看商品详情按钮的回调
const findSku = async (row: any) => {
  try {
    drawer.value = true;
    const result = await reqSkuInfo(row.id);
    if (result.code === 200) {
      skuInfo.value = result.data;
    }
  } catch (error) {
    console.error('获取商品详情失败:', error);
    ElMessage({ type: 'error', message: '获取商品详情失败' });
  }
}

//删除某一个已有的商品
const removeSku = async (id: number) => {
  try {
    const result = await reqRemoveSku(id);
    if (result.code === 200) {
      ElMessage({ type: 'success', message: '删除成功' });
      // 重新计算页码
      const pages = Math.max(1, Math.ceil((total.value - 1) / pageSize.value));
      if (pageNo.value > pages) pageNo.value = pages;
      // 重新获取数据
      getHasSku(pageNo.value);
    }
  } catch (error) {
    console.error('删除商品失败:', error);
    ElMessage({ type: 'error', message: '删除商品失败' });
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  /* 使用主题文本颜色，暗黑模式下可见 */
  color: var(--el-text-color-primary);
  opacity: 0.9;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: var(--app-carousel-even);
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: var(--app-carousel-odd);
}
</style>
