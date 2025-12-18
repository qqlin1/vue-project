import request from '@/utils/request'

export interface Role {
  id: number
  roleName?: string
  roleCode?: string
  description?: string | null
  createTime?: string
}

export interface RolePageData {
  records: Role[]
  total: number
  size: number
  current: number
  pages: number
}

export interface RolePageResponse {
  code: number
  message?: string
  data: RolePageData
  ok?: boolean
}

enum API {
  ROLE = '/admin/silicon/role'
}

export const listRoles = (page: number, limit: number) =>
  request.get(`${API.ROLE}/${page}/${limit}`)

export const saveRole = (data: Partial<Role>) =>
  request.post(`${API.ROLE}/save`, data)

export const updateRole = (data: Partial<Role>) =>
  request.put(`${API.ROLE}/update`, data)

export const removeRole = (id: number) =>
  request.delete(`${API.ROLE}/remove/${id}`)
