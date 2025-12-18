import request from '@/utils/request';

// 角色数据类型定义
export interface Role {
  id?: number;
  roleName: string;
  roleKey: string;
  createTime?: string;
  updateTime?: string;
}

// API响应数据类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message?: string;
  ok?: boolean;
}

// 分页响应数据类型
export interface PageResponse<T = any> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

enum API {
  // 角色列表（分页）
  ROLE_LIST_URL = '/admin/acl/role',
  // 保存角色
  SAVE_ROLE_URL = '/admin/acl/role/save',
  // 更新角色
  UPDATE_ROLE_URL = '/admin/acl/role/update',
  // 删除角色
  DELETE_ROLE_URL = '/admin/acl/role/remove',
}

// 获取角色列表（分页）
export const reqRoleList = (page: number, limit: number) =>
  request.get<ApiResponse<PageResponse<Role>>>(`${API.ROLE_LIST_URL}/${page}/${limit}`);

// 保存角色
export const reqSaveRole = (data: Role) =>
  request.post<ApiResponse<any>>(API.SAVE_ROLE_URL, data);

// 更新角色
export const reqUpdateRole = (data: Role) =>
  request.put<ApiResponse<any>>(API.UPDATE_ROLE_URL, data);

// 删除角色
export const reqDeleteRole = (id: number) =>
  request.delete<ApiResponse<any>>(`${API.DELETE_ROLE_URL}/${id}`);
