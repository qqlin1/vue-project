<template>
  <el-card class="box-card">
    <!-- 顶部放添加按钮 -->
    <el-button type="primary" :icon="Plus" @click="clickAdd">添加项目</el-button>
    <el-table :data="trademarkList" border>
      <el-table-column label="序号" align="center" type="index" width="80"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="180"></el-table-column>
      <el-table-column label="品牌LOGO" width="200">
        <template #default="scope">
          <img :src="scope.row.logoUrl" style="width: 100px; height: 100px; object-fit: contain;" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作" width="180">
        <template #default="scope">
          <el-button type="primary" size="small" @click="clickChange(scope)">编辑</el-button>

          <el-popconfirm :title="`您确定要删除${scope.tmName}?`" width="250px" icon="Delete"
            @confirm='removeTradeMark(scope.row.id)'>
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="demo-pagination-block">
      <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4" :page-sizes="[3, 10, 20, 30]"
        :size="size" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
        :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 添加品牌对话框 -->
    <el-dialog v-model="dialogVisible" :title="ruleForm.id ? '修改品牌' : '添加品牌'" width="500px">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="ruleForm.tmName" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload class="avatar-uploader" :auto-upload="false" :show-file-list="false" :on-change="handleFileChange"
            :before-upload="beforeAvatarUpload">
            <img v-if="ruleForm.logoUrl" :src="ruleForm.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false" :icon="Edit">取消</el-button>
          <el-button type="primary" @click="submitForm" :icon="Delete">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import type { ComponentSize } from 'element-plus'
import { reqGetTrademarkList, reqAddTrademark, reqUpdateTrademark } from '../../../api/product/trademark/index'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, SCOPE } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { nextTick } from 'vue'
// 定义品牌表单类型接口
interface BrandForm {
  id?: number | string | null // id是可选的，可以是number、string或null
  tmName: string
  logoUrl: string
}
// 响应式数据
const currentPage4 = ref(1)
const pageSize4 = ref(3)
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)
const trademarkList = ref<any[]>([])
const total = ref(0)

// 对话框相关数据
const dialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
// 使用定义的类型创建响应式表单对象
const ruleForm = reactive<BrandForm>({

  tmName: '',
  logoUrl: ''
})
const rules = reactive<FormRules>({
  tmName: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  logoUrl: [
    { required: true, message: '请输入品牌LOGO图片URL', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
  ]
})

// 分页处理函数
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
  //多余代码因为v-model以及帮我解决
  // pageSize4.value = val
  getHasTrademark()
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  //多余代码因为v-model以及帮我解决
  // currentPage4.value = val
  getHasTrademark()
}
const updateoraddTra = (ruleForm) => {
  if (ruleForm.id) {
    return reqUpdateTrademark(ruleForm)
  } else {
    return reqAddTrademark(ruleForm)
  }
}
// 表单提交函数
const submitForm = async () => {

  if (!ruleFormRef.value) return
  try {
    // 验证表单
    await ruleFormRef.value.validate()
    const result = await updateoraddTra(ruleForm)
    if (result.code === 200) {
      dialogVisible.value = false
      ElMessage({
        type: 'success',
        message: ruleForm.id ? '修改品牌成功' : '添加品牌成功'
      });
    } else {
      ElMessage({
        type: 'error',
        message: ruleForm.id ? '修改品牌失败' : '修改品牌失败'
      });
      dialogVisible.value = false
    }
    // 重新获取品牌列表
    await getHasTrademark()

    // 提示成功
    console.log('品牌添加成功')
  } catch (error) {
    console.error('表单验证失败或提交出错:', error)
  }
}

// 重置表单函数
const resetForm = () => {
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields()
  }
  // 重置表单数据，包括id、名称和logoUrl

  // 由于不再使用imageUrl，这里不需要额外处理
}

// 获取品牌数据
const getHasTrademark = async () => {
  try {
    const result = await reqGetTrademarkList(currentPage4.value, pageSize4.value)
    console.log(result);
    if (result && result.code === 200 && result.data) {
      trademarkList.value = result.data.records || []
      total.value = result.data.total || 0
    }
  } catch (error) {
    console.error('获取品牌数据失败:', error)
  }
}

import type { UploadProps } from 'element-plus'

// 处理文件选择，使用本地预览而不是上传
const handleFileChange: UploadProps['onChange'] = (file) => {
  if (file.raw) {
    // 本地预览并直接更新表单字段
    ruleForm.logoUrl = URL.createObjectURL(file.raw)
    // 验证该字段
    ruleFormRef.value?.validateField('logoUrl')
  }
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 检查文件类型（现在允许JPG和PNG）
  const isJPG = rawFile.type === 'image/jpeg'
  const isPNG = rawFile.type === 'image/png'
  const isLt2M = rawFile.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('图片格式必须是 JPG 或 PNG!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}
const clickAdd = () => {
  dialogVisible.value = true
  ruleForm.id = null
  ruleForm.tmName = ''
  ruleForm.logoUrl = ''
  nextTick(() => {
    ruleFormRef.value?.clearValidate('tmName');
    ruleFormRef.value?.clearValidate('logoUrl');
  })
}
//点击修改按钮
const clickChange = (scope: { row: BrandForm }) => {
  //逻辑顺序问题 ：先调用nextTick清除验证，再设置对话框可见性，这个顺序可能导致清除验证操作无效。
  dialogVisible.value = true//所以放在上面
  Object.assign(ruleForm, scope.row)
  //清空校验规则错误提示信息
  nextTick(() => {
    ruleFormRef.value?.clearValidate('tmName');
    ruleFormRef.value?.clearValidate('logoUrl');
  })
}
// 导入删除品牌API
import { reqDeleteTrademark } from '../../../api/product/trademark/index'

//点击删除按钮
const clickDel = async (scope: { row: BrandForm }) => {
  try {
    if (scope.row.id) {
      // 调用真实的删除API
      await reqDeleteTrademark(scope.row.id)
      // 删除成功后重新获取列表
      await getHasTrademark()
      ElMessage.success('品牌删除成功')
    }
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败，请重试')
  }
}
const removeTradeMark = (id: number) => {
  // 这个函数也可以调用删除API
  clickDel({ row: { id } as BrandForm })
}
//组件挂载完毕的钩子--发一次请求，获取第4页。一页4个
onMounted(() => {
  getHasTrademark()
})
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}



.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: var(--app-text-secondary);
  width: 178px;
  height: 178px;
  text-align: center;
}

.trademark-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trademark-content {
  margin-top: 20px;
}

.demo-pagination-block+.demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>
