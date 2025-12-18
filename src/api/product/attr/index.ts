import request from "@/utils/request";

// 分类数据类型定义
export interface Category1 {
  id: number;
  name: string;
}

export interface Category2 {
  id: number;
  name: string;
  category1Id: number;
}

export interface Category3 {
  id: number;
  name: string;
  category2Id: number;
}

// API响应数据类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
}

enum API {
  C1_URL = '/admin/product/getCategory1',
  C2_URL = '/admin/product/getCategory2',
  C3_URL = '/admin/product/getCategory3',
  ATTR_INFO_URL = '/admin/product/attrInfoList',
  ADD_OR_UPDATE_URL = '/admin/product/saveAttrInfo',
  DELETE_URL = '/admin/product/deleteAttr',
  UPDATE_ATTR_URL = '/admin/product/updateAttrInfo',

}

// 获取一级分类数据的请求函数
export const reqC1 = (): Promise<ApiResponse<Category1[]>> => request.get(API.C1_URL)

// 获取二级分类数据的请求函数（根据一级分类ID）
export const reqC2 = (category1Id: number): Promise<ApiResponse<Category2[]>> =>
  request.get(`${API.C2_URL}/${category1Id}`)

// 获取三级分类数据的请求函数（根据二级分类ID）
export const reqC3 = (category2Id: number): Promise<ApiResponse<Category3[]>> =>
  request.get(`${API.C3_URL}/${category2Id}`)

// 定义属性值数据类型
export interface AttrValue {
  id: number;
  valueName: string;
  flag?: boolean
}

// 定义属性数据类型
export interface Attr {
  id: number;
  attrName: string;
  attrValueList: AttrValue[];
}

// 定义保存属性的请求数据类型
export interface AttrSaveRequest {
  category1Id: number;
  category2Id: number;
  category3Id: number;
  id?: number;
  attrName: string;
  attrValueList: AttrValue[];
}

// 获取平台属性列表的请求函数（根据完整的分类路径：一级、二级、三级ID）
export const reqAttrInfoList = (category1Id: number, category2Id: number, category3Id: number): Promise<ApiResponse<Attr[]>> =>
  request.get(`${API.ATTR_INFO_URL}/${category1Id}/${category2Id}/${category3Id}`)

// 添加或更新属性的请求函数
export const reqAddOrUpdateAttr = (data: AttrSaveRequest): Promise<ApiResponse<any>> =>
  request.post(API.ADD_OR_UPDATE_URL, data)

// 修改属性的请求函数
export const reqUpdateAttr = (data: AttrSaveRequest): Promise<ApiResponse<any>> =>
  request.put(API.UPDATE_ATTR_URL, data)

// 删除属性的请求函数
export const reqDeleteAttr = (attrId: number, category3Id?: number): Promise<ApiResponse<any>> => {
  console.log('调用删除属性API:', { attrId, category3Id });
  // 构建查询参数对象 - 始终传递分类ID，即使为undefined
  const params = {
    category3Id
  };
  // 发送删除请求，同时传递分类ID作为查询参数
  return request.delete(`${API.DELETE_URL}/${attrId}`, { params });
}

// 导出API常量，供其他组件使用
export { API };
