// src/api/product/attr/type.ts

// 通用接口响应类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 1. 分类相关类型 ===================================
export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

// 2. 属性相关类型 ===================================

// 属性值对象
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean // 控制编辑模式/查看模式切换
}

// 存储属性值的数组
export type AttrValueList = AttrValue[]

// 属性对象 (添加/修改/列表展示共用)
export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
  attrIdAndValueId?: string // SPU模块中收集数据用
}

// 属性列表响应数据
export interface AttrResponseData extends ResponseData {
  data: Attr[]
}
