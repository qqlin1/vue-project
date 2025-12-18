import request from '@/utils/request'

export interface MenuItem {
  id: number
  name?: string
  path?: string
  parentId?: number | null
  sort?: number
}

export interface MenuPageData {
  records: MenuItem[]
  total: number
  size: number
  current: number
  pages: number
}

export interface MenuPageResponse {
  code: number
  message?: string
  data: MenuPageData
  ok?: boolean
}

enum API {
  MENU = '/admin/silicon/menu'
}

export const listMenus = (page: number, limit: number) =>
  request.get(`${API.MENU}/${page}/${limit}`)

export const saveMenu = (data: Partial<MenuItem>) =>
  request.post(`${API.MENU}/save`, data)

export const updateMenu = (data: Partial<MenuItem>) =>
  request.put(`${API.MENU}/update`, data)

export const removeMenu = (id: number) =>
  request.delete(`${API.MENU}/remove/${id}`)
