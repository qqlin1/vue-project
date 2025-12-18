import request from '@/utils/request';

// 权限数据类型定义
export interface Permission {
  id?: number;
  name: string;
  code?: string;
  pid?: number;
  children?: Permission[];
}

// API响应数据类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message?: string;
  ok?: boolean;
}

enum API {
  // 权限列表
  PERMISSION_LIST_URL = '/admin/acl/permission',
  // 保存权限
  SAVE_PERMISSION_URL = '/admin/acl/permission/save',
  // 更新权限
  UPDATE_PERMISSION_URL = '/admin/acl/permission/update',
  // 删除权限
  DELETE_PERMISSION_URL = '/admin/acl/permission/remove',
  // 获取角色的权限分配
  TO_ASSIGN_URL = '/admin/acl/permission/toAssign',
  // 分配权限
  DO_ASSIGN_URL = '/admin/acl/permission/doAssign',
}

// 获取权限列表
export const reqPermissionList = () =>
  request.get<ApiResponse<Permission[]>>(API.PERMISSION_LIST_URL);

// 保存权限
export const reqSavePermission = (data: Permission) =>
  request.post<ApiResponse<any>>(API.SAVE_PERMISSION_URL, data);

// 更新权限
export const reqUpdatePermission = (data: Permission) =>
  request.put<ApiResponse<any>>(API.UPDATE_PERMISSION_URL, data);

// 删除权限
export const reqDeletePermission = (id: number) =>
  request.delete<ApiResponse<any>>(`${API.DELETE_PERMISSION_URL}/${id}`);

// 获取角色的权限分配
export const reqToAssign = (roleId: number) =>
  request.get<ApiResponse<Array<{ id: number; name: string; selected: boolean }>>>(`${API.TO_ASSIGN_URL}/${roleId}`);

// 分配权限
export const reqDoAssign = (roleId: number, permissionIdList: number[]) =>
  request.post<ApiResponse<any>>(API.DO_ASSIGN_URL, { roleId, permissionIdList });
