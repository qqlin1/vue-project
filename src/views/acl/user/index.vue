<template>
  <div>
    <!-- 1. 顶部搜索区域 -->
    <el-card style="height: 80px">
      <el-form :inline="true" class="search-form">
        <el-form-item label="用户名:">
          <el-input placeholder="请你输入搜索用户名" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search">搜索</el-button>
          <el-button icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 2. 中间表格内容区域 -->
    <el-card style="margin: 10px 0">
      <!-- 顶部按钮 -->
      <el-button type="primary" icon="Plus" @click="AddUser()">添加用户</el-button>
      <el-button type="danger" icon="Delete" @click="handleBatchDelete()" :disabled="selectedCount === 0">
        批量删除 ({{ selectedCount }})
      </el-button>
      <!-- Duplicate Add button removed -->
      <!-- 表格区域 -->
      <!-- data 绑定的是数组，现在是空数组 []，所以会显示“暂无数据”，和你截图一样 -->
      <el-table ref="tableRef" :data="tableData" style="width: 100%; margin: 10px 0" border
        @selection-change="handleSelectionChange" :row-key="(row) => row.id">
        <!-- 复选框列，添加reserve-selection保持跨页选中状态 -->
        <el-table-column type="selection" width="55" align="center" :reserve-selection="true"></el-table-column>
        <!-- 序号列 (#) -->
        <el-table-column type="index" label="#" width="80" align="center"></el-table-column>

        <el-table-column label="ID" prop="id" width="80" align="center"></el-table-column>
        <el-table-column label="用户名字" prop="username" align="center"></el-table-column>
        <el-table-column label="用户名称" prop="name" align="center"></el-table-column>
        <el-table-column label="用户角色" prop="roleName" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" width="180"></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" align="center" width="180"></el-table-column>

        <el-table-column label="操作" width="300" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" icon="User">分配角色</el-button>
            <el-button type="warning" size="small" icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 3. 分页器 -->
      <!-- 这里的 total 写死 400 只是为了还原你截图的效果 -->
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 10]"
        :background="true" layout="prev, pager, next, jumper, ->, total, sizes" :total="total" />
      <!-- 4.抽屉 -->


      <!-- Add/Edit User Drawer -->
      <el-drawer :title="isEditMode ? '编辑用户' : '添加用户'" v-model="drawerVisible" :with-header="true" size="40%"
        direction="rtl">
        <el-form :model="userForm" label-width="80px" style="padding: 16px 16px 60px 16px;">
          <el-form-item label="用户姓名">
            <el-input v-model="userForm.username" placeholder="请输入用户姓名" />
          </el-form-item>
          <el-form-item label="用户昵称">
            <el-input v-model="userForm.name" placeholder="请输入用户昵称" />
          </el-form-item>
          <el-form-item label="用户密码">
            <el-input type="password" v-model="userForm.password" placeholder="请输入用户密码" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="drawer-footer" style="padding: 12px 16px; text-align: right;">
            <el-button @click="closeDrawer">取消</el-button>
            <el-button type="primary" @click="confirmDrawer">确定</el-button>
          </div>
        </template>
      </el-drawer>

    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, reactive, computed, nextTick } from 'vue'
import { reqUserPageList, reqSaveUser, reqUpdateUser, reqDeleteUser, reqBatchDeleteUser } from '@/api/acl/user'
import type { AclPageResponse, AclUser } from '@/api/acl/user'
import { ElMessage, ElMessageBox } from 'element-plus'
// 导入selection store
import { useSelectionStore } from '@/stores/modules/selection'
// 搜索关键字
const keyword = ref('')

// 当前页码
const pageNo = ref(1)

// 每页显示条数
const pageSize = ref(5)

// 总数量
const total = ref(0)

// 表格数据：目前是空的，为了显示“暂无数据”
// 如果你想看有数据的样子，可以在里面写几个对象
const tableData = ref<AclUser[]>([])
// 表格ref，用于获取选中的行
const tableRef = ref<any>(null)
// 初始化selection store
const selectionStore = useSelectionStore()
// 保存选中的行
const selectedRows = ref<AclUser[]>([])
// 选中的数量（从store获取，确保组件切换时保持）
const selectedCount = computed(() => selectionStore.userSelectionCount)
//抽屉的开关
const drawerVisible = ref(false)
// 区分是新增还是编辑模式
const isEditMode = ref(false)
// 当前编辑的用户ID
const editingUserId = ref<number | undefined>()
// 新增/编辑用户表单
const userForm = reactive<Partial<AclUser>>({ username: '', name: '', password: '' })

// 关闭抽屉并重置表单
const closeDrawer = () => {
  drawerVisible.value = false
  isEditMode.value = false
  editingUserId.value = undefined
  userForm.username = ''
  userForm.name = ''
  userForm.password = ''
}

// 编辑用户
const handleEdit = (row: AclUser) => {
  console.log('编辑用户:', row)
  // 设置为编辑模式
  isEditMode.value = true
  // 保存当前编辑的用户ID
  editingUserId.value = row.id
  // 填充表单数据
  userForm.username = row.username || ''
  userForm.name = row.name || ''
  // 密码字段不填充，允许留空表示不修改密码
  userForm.password = ''
  // 打开抽屉
  drawerVisible.value = true
}

// 删除用户
const handleDelete = async (row: AclUser) => {
  try {
    console.log('删除用户:', row)
    // 显示确认对话框
    await ElMessageBox.confirm('确定要删除该用户吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 调用删除API
    const result = await reqDeleteUser(row.id)
    if (result && result.code === 200) {
      ElMessage({ type: 'success', message: '删除成功' })
      // 重新获取用户列表
      ReqPageList()
    } else {
      ElMessage({ type: 'error', message: result.message || '删除失败' })
    }
  } catch (e: any) {
    if (e === 'cancel') {
      // 用户取消了删除操作
      ElMessage({ type: 'info', message: '已取消删除' })
      return
    }
    console.error('删除用户失败:', e)
    ElMessage({ type: 'error', message: '删除失败' })
  }
}

// 批量删除用户
const handleBatchDelete = async () => {
  try {
    console.log('选中的行:', selectedRows.value)
    console.log('选中数量:', selectedCount.value)

    if (selectedCount.value === 0) {
      ElMessage({ type: 'warning', message: '请选择要删除的用户' })
      return
    }

    // 显示确认对话框
    await ElMessageBox.confirm(`确定要删除选中的${selectedCount.value}个用户吗？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 提取选中用户的ID
    const idList = selectedRows.value.map(row => row.id)
    console.log('要删除的ID列表:', idList)

    // 调用批量删除API
    const result = await reqBatchDeleteUser(idList)
    if (result && result.code === 200) {
      ElMessage({ type: 'success', message: `删除成功，共删除${selectedCount.value}个用户` })
      // 重新获取用户列表
      ReqPageList()
      // 清空选中状态
      clearSelection()
    } else {
      ElMessage({ type: 'error', message: result.message || '删除失败' })
    }
  } catch (e: any) {
    if (e === 'cancel') {
      // 用户取消了删除操作
      ElMessage({ type: 'info', message: '已取消删除' })
      return
    }
    console.error('批量删除用户失败:', e)
    ElMessage({ type: 'error', message: '批量删除失败' })
  }
}

// 清空选中状态
const clearSelection = () => {
  tableRef.value?.clearSelection()
  selectedRows.value = []
  // 同时清空store中的选中状态
  selectionStore.clearUserSelection()
}

// 恢复选中状态（数据加载完成后调用）
const restoreSelection = () => {
  if (!tableRef.value || !tableData.value.length) return

  // 从store获取选中的ID列表
  const selectedIds = selectionStore.userSelection
  if (selectedIds.length === 0) return

  // 遍历表格数据，将匹配的行设为选中状态
  tableData.value.forEach(row => {
    if (selectedIds.includes(row.id)) {
      tableRef.value.toggleRowSelection(row, true)
    }
  })
}

// 确认提交抽屉中的表单
const confirmDrawer = async () => {
  // 简单校验
  if (!userForm.username) {
    ElMessage({ type: 'warning', message: '请输入用户名' })
    return
  }

  // 新增模式下，密码是必填的；编辑模式下，密码可选
  if (!isEditMode.value && !userForm.password) {
    ElMessage({ type: 'warning', message: '请输入密码' })
    return
  }

  try {

    if (isEditMode.value && editingUserId.value) {
      // 编辑模式
      const editData = {
        id: editingUserId.value,
        username: userForm.username,
        name: userForm.name
      }
      // 只有当密码不为空时才包含密码字段
      if (userForm.password) {
        editData.password = userForm.password
      }

      console.log('发送编辑请求，数据:', editData)
      console.log('发送编辑请求，数据类型:', typeof editData.id)

      // 发送编辑请求
      const updateResult = await reqUpdateUser(editData)
      console.log('编辑请求结果:', updateResult)

      if (updateResult && updateResult.code === 200) {
        ElMessage({ type: 'success', message: '更新成功' })
        // 重新获取用户列表
        ReqPageList()
        // 关闭抽屉
        closeDrawer()
      } else {
        ElMessage({ type: 'error', message: updateResult.message || '更新失败' })
      }
    } else {
      // 新增模式
      const newUser: AclUser = {
        id: Date.now(),
        createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        username: userForm.username,
        name: userForm.name,
        password: userForm.password || '',
        roleName: ''
      }

      console.log('发送新增请求，数据:', newUser)
      // 发送新增请求
      const saveResult = await reqSaveUser(newUser)
      console.log('新增请求结果:', saveResult)

      if (saveResult && saveResult.code === 200) {
        ElMessage({ type: 'success', message: '添加成功' })
        // 重新获取用户列表
        ReqPageList()
        // 关闭抽屉
        closeDrawer()
      } else {
        ElMessage({ type: 'error', message: saveResult.message || '添加失败' })
      }
    }
  } catch (e: any) {
    console.error('捕获到错误:', e)
    console.error('错误堆栈:', e.stack)
    ElMessage({ type: 'error', message: isEditMode.value ? '更新失败' : '添加失败' })
  }
}
//挂载的时候请求列表数据
onMounted(() => {
  ReqPageList()
})

// 当页码或页大小改变时刷新数据
watch([pageNo, pageSize], () => {
  ReqPageList()
})
//发送请求方法
const ReqPageList = async () => {
  try {
    console.log('开始请求用户列表:', pageNo.value, pageSize.value)
    const result: AclPageResponse = await reqUserPageList(pageNo.value, pageSize.value)
    console.log('用户列表请求结果:', result)
    // 后端返回 data.records
    if (result.code === 200) {
      console.log('用户列表数据:', result.data.records)
      tableData.value = result.data.records
      total.value = result.data.total || 0
      console.log('用户列表更新后:', tableData.value)

      // 数据加载完成后，恢复之前的选中状态
      nextTick(() => {
        restoreSelection()
      })
    }
  } catch (err) {
    ElMessage({
      type: 'error',
      message: '请求异常，请检查控制台和网络'
    })
    console.error('获取用户列表失败：', err)
  }
}
// 点击添加用户
const AddUser = () => {
  // 设置为新增模式
  isEditMode.value = false
  // 重置编辑用户ID
  editingUserId.value = undefined
  // 重置表单数据
  userForm.username = ''
  userForm.name = ''
  userForm.password = ''
  // 打开抽屉
  drawerVisible.value = true
}

// 处理选中状态变化
const handleSelectionChange = (rows: AclUser[]) => {
  selectedRows.value = rows
  console.log('选中的行:', selectedRows.value)
  console.log('选中数量:', selectedCount.value)

  // 将选中的用户ID保存到store中
  const selectedIds = rows.map(row => row.id)
  selectionStore.saveUserSelection(selectedIds)
}
// 表单校验规则（可选，当前未启用）
// const rules = ref({ username: [{ required: true, message: '请输入用户名', trigger: 'blur' }] })
</script>

<style scoped>
.search-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
