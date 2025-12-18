<template>
  <div class="permission-container">
    <el-card style="margin-bottom:12px;">
      <div class="card-header">
        <div>菜单/权限（静态示例）</div>
        <div>
          <el-button type="primary" icon="Plus" @click="onAddRoot">添加根权限</el-button>
        </div>
      </div>
    </el-card>

    <el-card>
      <el-tree :data="permissionList" :props="defaultProps" node-key="id" highlight-current>
        <template #default="{ data }">
          <div class="custom-tree-node">
            <div>{{ data.name }} <small v-if="data.code">（{{ data.code }}）</small></div>
            <div>
              <el-button size="mini" type="primary" @click.stop="onAddChild(data)">添加子项</el-button>
              <el-button size="mini" type="warning" @click.stop="onEdit(data)">编辑</el-button>
              <el-button size="mini" type="danger" @click.stop="onDelete(data)">删除</el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editing?.id ? '编辑权限' : '添加权限'">
      <el-form :model="form">
        <el-form-item label="名称">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="权限值">
          <el-input v-model="form.code" placeholder="例如 sys:user:list" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// 导入真实的API
import { reqPermissionList, reqSavePermission, reqUpdatePermission, reqDeletePermission } from '@/api/acl/permission'
// 导入类型
import type { Permission } from '@/api/acl/permission'

// 权限列表数据
const permissionList = ref<Permission[]>([])

const defaultProps = { children: 'children', label: 'name' }

const dialogVisible = ref(false)
const editing = ref<Permission | null>(null)
const parentForNew = ref<Permission | null>(null)
const form = ref<{ name: string; code?: string }>({ name: '', code: '' })

// 页面挂载时获取权限列表
onMounted(() => {
  getPermissionList()
})

// 获取权限列表
const getPermissionList = async () => {
  try {
    const result = await reqPermissionList()
    if (result.code === 200) {
      permissionList.value = result.data || []
    }
  } catch (error) {
    console.error('获取权限列表失败:', error)
    ElMessage({ type: 'error', message: '获取权限列表失败' })
  }
}

const openDialogFor = (parent: Permission | null, node?: Permission) => {
  parentForNew.value = parent
  editing.value = node || null
  form.value = { name: node?.name || '', code: node?.code || '' }
  dialogVisible.value = true
}

const onAddRoot = () => openDialogFor(null)
const onAddChild = (node: Permission) => openDialogFor(node)
const onEdit = (node: Permission) => openDialogFor(null, node)

// 保存权限
  const save = async () => {
    if (!form.value.name) {
      ElMessage({ type: 'warning', message: '请输入名称' })
      return
    }
    
    try {
      if (editing.value) {
        // 更新现有权限
        await reqUpdatePermission({
          id: editing.value.id,
          name: form.value.name,
          code: form.value.code
        })
        ElMessage({ type: 'success', message: '更新权限成功' })
      } else {
        // 添加新权限
        await reqSavePermission({
          name: form.value.name,
          code: form.value.code,
          pid: parentForNew.value?.id || 0 // 添加父ID，根权限为0
        })
        ElMessage({ type: 'success', message: '添加权限成功' })
      }
      
      // 关闭对话框
      dialogVisible.value = false
      // 重新获取权限列表
      getPermissionList()
    } catch (error) {
      console.error('保存权限失败:', error)
      ElMessage({ type: 'error', message: '保存权限失败' })
    }
  }

// 删除权限
const onDelete = async (node: Permission) => {
  if (!node.id) return
  
  try {
    await reqDeletePermission(node.id)
    ElMessage({ type: 'success', message: '删除权限成功' })
    // 重新获取权限列表
    getPermissionList()
  } catch (error) {
    console.error('删除权限失败:', error)
    ElMessage({ type: 'error', message: '删除权限失败' })
  }
}

const closeDialog = () => { dialogVisible.value = false }
</script>

<style scoped>
.permission-container {
  padding: 16px
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center
}

.custom-tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%
}
</style>
