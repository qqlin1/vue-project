<template>
  <div class="role-container">
    <el-card style="margin-bottom: 12px;">
      <div class="card-header">
        <div>角色管理</div>
        <div>
          <el-button type="primary" icon="Plus" @click="onAdd">添加角色</el-button>
        </div>
      </div>
    </el-card>

    <el-card>
      <el-table :data="roles" style="width:100%" row-key="id" border>
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="roleName" label="角色名" />
        <el-table-column prop="roleKey" label="角色标识" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="权限数" width="100">
          <template #default="{ row }">
            <span>0</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="onAssign(row)">分配权限</el-button>
            <el-button size="small" type="warning" icon="Edit" @click="onEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" icon="Delete" @click="onDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑角色' : '添加角色'">
      <el-form :model="form">
        <el-form-item label="角色名">
          <el-input v-model="form.roleName" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="角色标识">
          <el-input v-model="form.roleKey" placeholder="例如 admin" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog v-model="assignDialogVisible" title="分配权限" width="600px">
      <div style="max-height:400px; overflow:auto;">
        <el-tree ref="permTreeRef" :data="permissionTree" :props="permProps" show-checkbox node-key="id"
          default-expand-all />
      </div>
      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAssign">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// 导入真实的API
import { reqRoleList, reqSaveRole, reqUpdateRole, reqDeleteRole } from '@/api/acl/role'
import { reqPermissionList, reqToAssign, reqDoAssign } from '@/api/acl/permission'
// 导入类型
import type { Role } from '@/api/acl/role'
import type { Permission } from '@/api/acl/permission'

// 分页相关数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 角色列表数据
const roles = ref<Role[]>([])

const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const form = reactive<Partial<Role>>({ roleName: '', roleKey: '' })

// 分配权限相关数据
const assignDialogVisible = ref(false)
const permTreeRef = ref<any>(null)
const currentRole = ref<Role | null>(null)
const permissionTree = ref<Permission[]>([])
const assignedPermissions = ref<number[]>([])

const permProps = { children: 'children', label: 'name' }

// 页面挂载时获取角色列表
onMounted(() => {
  getRoleList()
})

// 分页事件处理函数
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getRoleList()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getRoleList()
}

// 获取角色列表
const getRoleList = async () => {
  try {
    console.log('开始请求角色列表:', currentPage.value, pageSize.value)
    const result = await reqRoleList(currentPage.value, pageSize.value)
    console.log('角色列表请求结果:', result)
    if (result.code === 200) {
      console.log('角色列表数据:', result.data.records)
      roles.value = result.data.records || []
      total.value = result.data.total || 0
      console.log('角色列表更新后:', roles.value)
    }
  } catch (error) {
    console.error('获取角色列表失败:', error)
    ElMessage({ type: 'error', message: '获取角色列表失败' })
  }
}

const onAdd = () => {
  editingId.value = null
  form.roleName = ''
  form.roleKey = ''
  dialogVisible.value = true
}

const onEdit = (row: Role) => {
  editingId.value = row.id
  form.roleName = row.roleName
  form.roleKey = row.roleKey
  dialogVisible.value = true
}

const onDelete = async (row: Role) => {
  try {
    if (row.id) {
      await reqDeleteRole(row.id)
      ElMessage({ type: 'success', message: '删除成功' })
      // 重新获取角色列表
      getRoleList()
    }
  } catch (error) {
    console.error('删除角色失败:', error)
    ElMessage({ type: 'error', message: '删除角色失败' })
  }
}

const closeDialog = () => {
  dialogVisible.value = false
}

const save = async () => {
  if (!form.roleName) {
    ElMessage({ type: 'warning', message: '请输入角色名' })
    return
  }

  try {
    if (editingId.value && form.roleKey) {
      // 更新角色
      await reqUpdateRole({ id: editingId.value, roleName: form.roleName, roleKey: form.roleKey })
      ElMessage({ type: 'success', message: '更新角色成功' })
    } else if (form.roleKey) {
      // 添加角色
      await reqSaveRole({ roleName: form.roleName, roleKey: form.roleKey })
      ElMessage({ type: 'success', message: '添加角色成功' })
    }

    // 关闭对话框
    dialogVisible.value = false
    // 重新获取角色列表
    getRoleList()
  } catch (error) {
    console.error('保存角色失败:', error)
    ElMessage({ type: 'error', message: '保存角色失败' })
  }
}

// --- 分配权限逻辑 ---
const onAssign = async (row: Role) => {
  if (!row.id) return

  currentRole.value = row
  assignDialogVisible.value = true

  try {
    // 获取所有权限
    const permissionResult = await reqPermissionList()
    if (permissionResult.code === 200) {
      permissionTree.value = permissionResult.data || []
    }

    // 获取角色已分配的权限
    const assignResult = await reqToAssign(row.id)
    if (assignResult.code === 200) {
      // 从返回的数据中提取已选中的权限ID
      assignedPermissions.value = assignResult.data
        .filter(permission => permission.selected)
        .map(permission => permission.id)
    }

    // 等待 tree 挂载后设置 checked keys
    setTimeout(() => {
      permTreeRef.value?.setCheckedKeys(assignedPermissions.value)
    }, 0)
  } catch (error) {
    console.error('获取权限数据失败:', error)
    ElMessage({ type: 'error', message: '获取权限数据失败' })
  }
}

const confirmAssign = async () => {
  if (!currentRole.value?.id) return

  try {
    const checkedKeys = permTreeRef.value?.getCheckedKeys() || []
    await reqDoAssign(currentRole.value.id, checkedKeys)

    ElMessage({ type: 'success', message: '分配权限成功' })
    assignDialogVisible.value = false
  } catch (error) {
    console.error('分配权限失败:', error)
    ElMessage({ type: 'error', message: '分配权限失败' })
  }
}
</script>

<style scoped>
.role-container {
  padding: 20px
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center
}
</style>
