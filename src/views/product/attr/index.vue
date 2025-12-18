<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin-top: 20px;" v-show="!scene">
      <el-button icon="Plus" type="primary" :disabled="!category.c3ID" @click="addAttr">添加平台属性</el-button>
      <el-table :data="attrInfoList" border>
        <el-table-column label="序号" type="index" width="80"></el-table-column>
        <el-table-column label="属性名称" prop="attrName"></el-table-column>
        <el-table-column label="属性值名称">
          <template #="{ row }">
            <el-tag v-for="item in row.attrValueList" :key="row.id">{{ item.valueName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button icon="Edit" type="primary" size="small" @click="changeAttr(row)"></el-button>
            <el-popconfirm title="确定要删除该属性吗？" confirm-button-text="确定" cancel-button-text="取消"
              @confirm="deleteAttr(row.id)">
              <template #reference>
                <el-button icon="Delete" type="danger" size="small"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card v-show="scene">
      <el-form :inline="true">
        <el-form-item label="属性名称"> <el-input placeholder="请输入属性值" v-model="Attr.attrName"></el-input></el-form-item>
      </el-form>
      <el-button icon="Plus" type="primary" :disabled="!Attr.attrName" @click="AddattrValueList()">添加属性值</el-button>
      <el-button @click="clearForm()">取消</el-button>
      <el-table :data="Attr.attrValueList">
        <el-table-column label="序号" type="index" width="80"></el-table-column>
        <el-table-column label="属性值名称" width="300">
          <template #="{ row, $index }">
            <el-input :ref="(vc: any) => inputArr[$index] = vc" v-model="row.valueName" v-if="row.flag"
              @blur="toSee(row, $index)"></el-input>
            <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button icon="Delete" type="primary" size="small"
              @click="Attr.attrValueList.splice($index, 1)"></el-button> </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="Attr.id ? changeAttrValueList() : SaveAttrValueList()">保存</el-button>
      <el-button @click="clearForm()">取消</el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/stores/modules/category';
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue';
import { reqAttrInfoList, reqAddOrUpdateAttr, reqUpdateAttr, reqDeleteAttr } from '@/api/product/attr';
import { ElMessage } from 'element-plus';
import { NULL } from 'sass';
const inputArr = ref<any>([])

const Attr = reactive({
  category1Id: null,
  category2Id: null,
  category3Id: null,
  attrName: '',
  attrValueList: [],

})
const category = useCategoryStore()
const attrInfoList = ref([])
const scene = ref(false)
//路由组件销毁的时候，对应仓库清空
onBeforeUnmount(() => {
  //清空仓库的数据
  category.$reset()
})
watch(() => category.c3ID, (newc3id) => {
  attrInfoList.value = []
  if (!category.c3ID) return;
  GetList(category.c1ID, category.c2ID, category.c3ID)
})
const GetList = async (c1ID: number, c2ID: number, c3ID: number) => {
  try {
    const result = await reqAttrInfoList(c1ID, c2ID, c3ID)
    if (result.code === 200) {
      // 将数据保存到store中
      attrInfoList.value = result.data
    }
  } catch (error) {
    console.error('获取属性列表失败:', error)
  }
}
const addAttr = () => {
  scene.value = true;
}
const AddattrValueList = () => {

  // 添加前检查是否已经有一个空的编辑状态项，如果有则不添加新的
  const hasEmptyEditingItem = Attr.attrValueList.some(item => item.flag && item.valueName.trim() === '');

  if (hasEmptyEditingItem) {
    ElMessage({
      type: 'warning',
      message: '请先完成当前编辑项'
    });
    return;
  }

  // 添加一个包含valueName属性的对象，初始为空字符串，并设置flag为true使其默认处于编辑状态
  const newItem = { valueName: '', flag: true };
  Attr.attrValueList.push(newItem);
}
const SaveAttrValueList = async () => {
  if (!Attr.attrValueList || Attr.attrValueList.length === 0) {
    ElMessage({
      type: 'error',
      message: '属性值列表不能为空'
    })
    return
  }
  Attr.category1Id = category.c1ID
  Attr.category2Id = category.c2ID
  Attr.category3Id = category.c3ID
  const result = await reqAddOrUpdateAttr(Attr)

  if (result.code === 200) {
    clearForm()
    ElMessage({
      type: 'success',
      message: '添加成功'
    })
  }

}
const changeAttrValueList = async () => {
  try {
    // 确保categoryId已设置
    Attr.category1Id = category.c1ID
    Attr.category2Id = category.c2ID
    Attr.category3Id = category.c3ID

    // 调用修改属性的API
    const result = await reqUpdateAttr(Attr)

    if (result.code === 200) {
      clearForm()
      ElMessage({
        type: 'success',
        message: '修改成功'
      })

    }
  } catch (error) {
    console.error('修改属性失败:', error)
    ElMessage({
      type: 'error',
      message: '修改失败，请重试'
    })
  }
}
const clearForm = () => {
  scene.value = false;
  GetList(category.c1ID, category.c2ID, category.c3ID)
  Object.assign(Attr, {
    category1Id: null,
    category2Id: null,
    category3Id: null,
    attrName: '',
    attrValueList: [],
  })
}
const changeAttr = (row) => {
  scene.value = true;
  console.log(row);

  // 实现深拷贝，避免浅拷贝导致的引用问题
  Attr.id = row.id;
  Attr.category1Id = row.category1Id;
  Attr.category2Id = row.category2Id;
  Attr.category3Id = row.category3Id;
  Attr.attrName = row.attrName;

  // 对attrValueList数组进行深拷贝，避免引用相同数组
  Attr.attrValueList = row.attrValueList ? row.attrValueList.map(item => ({
    ...item,
    // 确保每个item都是新对象，flag设置为false表示非编辑状态
    flag: false
  })) : [];
}
const deleteAttr = async (attrId) => {
  try {
    console.log('执行删除操作:', { attrId, categoryId: category.c3ID });
    // 调用删除API时同时传递属性ID和当前选中的分类ID
    const result = await reqDeleteAttr(attrId, category.c3ID)
    if (result.code == 200) {
      console.log('删除API调用成功，准备刷新列表');
      console.log(Attr.attrValueList.length);

      // 强制清空列表，然后重新获取
      attrInfoList.value = [];
      // 使用setTimeout确保UI先更新，再重新获取数据
      setTimeout(() => {
        GetList(category.c1ID, category.c2ID, category.c3ID)

      }, 0);
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    }
  } catch (error) {
    console.error('删除属性失败:', error)
    ElMessage({
      type: 'error',
      message: '删除失败，请检查网络连接'
    })
  }
}
const toSee = (row) => {
  // 找到row对象在数组中的实际位置，不依赖$index
  const index = Attr.attrValueList.findIndex(item => item === row);

  // 检查是否为空值
  if (row.valueName.trim() === '') {
    ElMessage({
      type: 'error',
      message: '属性值名称不能为空'
    })
    // 只有在找到有效索引时才执行删除操作
    if (index !== -1) {
      Attr.attrValueList.splice(index, 1)
    }
    return
  }

  // 检查是否存在重复值（排除当前元素本身）
  const duplicate = Attr.attrValueList.some((item, idx) => {
    // 确保不是当前元素本身，并且值相同
    return idx !== index && item.valueName.trim() === row.valueName.trim();
  });

  if (duplicate) {
    ElMessage({
      type: 'error',
      message: '属性值名称不能重复'
    })
    // 只有在找到有效索引时才执行删除操作
    if (index !== -1) {
      Attr.attrValueList.splice(index, 1)
    }
    return
  }

  row.flag = false
}
const toEdit = (row, $index) => {
  row.flag = true;
  nextTick(() => {
    inputArr.value[$index].focus()
  })

}
</script>

<style scoped></style>
