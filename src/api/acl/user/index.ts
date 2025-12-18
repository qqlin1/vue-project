import request from "@/utils/request";

export interface AclUser {
  id: number;
  createTime?: string;
  updateTime?: string;
  username?: string;
  password?: string;
  name?: string;
  phone?: string | null;
  roleName?: string;
}

export interface AclPageData {
  records: AclUser[];
  total: number;
  size: number;
  current: number;
  pages: number;
  orders?: unknown[];
}

export interface AclPageResponse {
  code: number;
  message?: string;
  data: AclPageData;
  ok?: boolean;
}

enum API {
  USER_PAGE_LIST = '/admin/acl/user'
}

// 正确地拼接 /admin/acl/user/{page}/{limit}
export const reqUserPageList = (page: number, limit: number): Promise<AclPageResponse> =>
  request.get(`${API.USER_PAGE_LIST}/${page}/${limit}`)

// 新增用户
export interface SaveOrUpdateResp<T=unknown> {
  code: number;
  data: T;
  message?: string;
  ok?: boolean;
}

export const reqSaveUser = (data: Partial<AclUser>): Promise<SaveOrUpdateResp<AclUser>> =>
  request.post(`${API.USER_PAGE_LIST}/save`, data)

// 更新用户
export const reqUpdateUser = (data: Partial<AclUser>): Promise<SaveOrUpdateResp<AclUser>> =>
  request.put(`${API.USER_PAGE_LIST}/update`, data)

// 删除用户
export const reqDeleteUser = (id: number): Promise<SaveOrUpdateResp<any>> =>
  request.delete(`${API.USER_PAGE_LIST}/remove/${id}`)

// 批量删除用户
export const reqBatchDeleteUser = (idList: number[]): Promise<SaveOrUpdateResp<any>> =>
  request.delete(`${API.USER_PAGE_LIST}/batchRemove`, { data: { idList } })
