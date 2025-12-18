// src/mock/spuMock.ts
import { MockMethod } from 'vite-plugin-mock'

// 模拟的通用响应结构
const successResponse = (data: any) => {
  return {
    code: 200,
    message: '成功',
    ok: true,
    data: data,
  }
}

export default [
  // 1. 获取三级分类下的 SPU 列表
  {
    url: '/api/admin/product/:page/:limit',
    method: 'get',
    response: ({ query }) => {
      return successResponse({
        records: [
          {
            id: 1,
            spuName: '华为Mate60',
            description: '遥遥领先',
            category3Id: 61,
            tmId: 1,
            spuSaleAttrList: null,
            spuImageList: null,
          },
          {
            id: 2,
            spuName: 'iPhone 15',
            description: '苹果手机',
            category3Id: 61,
            tmId: 2,
            spuSaleAttrList: null,
            spuImageList: null,
          },
          {
            id: 3,
            spuName: '小米14',
            description: '徕卡影像',
            category3Id: 61,
            tmId: 3,
            spuSaleAttrList: null,
            spuImageList: null,
          },
        ],
        total: 10,
        size: 3,
        current: 1,
        pages: 4,
      })
    },
  },
  // 2. 获取全部品牌
  {
    url: '/api/admin/product/baseTrademark/getTrademarkList',
    method: 'get',
    response: () => {
      return successResponse([
        { id: 1, tmName: '华为', logoUrl: 'http://dummyimage.com/100x100' },
        { id: 2, tmName: '苹果', logoUrl: 'http://dummyimage.com/100x100' },
        { id: 3, tmName: '小米', logoUrl: 'http://dummyimage.com/100x100' },
      ])
    },
  },
  // 3. 获取 SPU 图片列表
  {
    url: RegExp('/api/admin/product/spuImageList/.*'),
    method: 'get',
    response: () => {
      return successResponse([
        { id: 1, imgName: '正面图', imgUrl: 'https://img1.baidu.com/it/u=364488547,2216923041&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' },
        { id: 2, imgName: '背面图', imgUrl: 'https://img2.baidu.com/it/u=2983920986,3520767603&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' },
      ])
    },
  },
  // 4. 获取 SPU 销售属性
  {
    url: RegExp('/api/admin/product/spuSaleAttrList/.*'),
    method: 'get',
    response: () => {
      return successResponse([
        {
          id: 1,
          saleAttrName: '颜色',
          baseSaleAttrId: 1,
          spuSaleAttrValueList: [
            { id: 11, saleAttrValueName: '黑色', baseSaleAttrId: 1 },
            { id: 12, saleAttrValueName: '白色', baseSaleAttrId: 1 },
          ],
        },
        {
          id: 2,
          saleAttrName: '内存',
          baseSaleAttrId: 2,
          spuSaleAttrValueList: [
            { id: 21, saleAttrValueName: '128G', baseSaleAttrId: 2 },
            { id: 22, saleAttrValueName: '256G', baseSaleAttrId: 2 },
          ],
        },
      ])
    },
  },
  // 5. 获取基础销售属性（颜色、版本等）
  {
    url: '/api/admin/product/baseSaleAttrList',
    method: 'get',
    response: () => {
      return successResponse([
        { id: 1, name: '颜色' },
        { id: 2, name: '版本' },
        { id: 3, name: '尺码' },
      ])
    },
  },
  // 6. 添加或更新 SPU
  {
    url: '/api/admin/product/saveSpuInfo',
    method: 'post',
    response: () => successResponse(null),
  },
  {
    url: '/api/admin/product/updateSpuInfo',
    method: 'post',
    response: () => successResponse(null),
  },
  // 7. 删除 SPU
  {
    url: RegExp('/api/admin/product/deleteSpu/.*'),
    method: 'delete',
    response: () => successResponse(null),
  },
  // 8. 获取平台属性 (SkuForm 需要)
  // 注意：你的代码中 reqAttr 需要三个参数，这里简单模拟
  {
    url: RegExp('/api/admin/product/attrInfoList/.*'),
    method: 'get',
    response: () => {
      return successResponse([
        {
          id: 1,
          attrName: '操作系统',
          attrValueList: [
            { id: 101, valueName: 'Android' },
            { id: 102, valueName: 'iOS' },
          ]
        },
        {
          id: 2,
          attrName: '运行内存',
          attrValueList: [
            { id: 201, valueName: '8G' },
            { id: 202, valueName: '12G' },
          ]
        }
      ])
    }
  },
  // 9. 添加 SKU
  {
    url: '/api/admin/product/saveSkuInfo',
    method: 'post',
    response: () => successResponse(null)
  },
  // 10. 查看 SKU 列表
  {
    url: RegExp('/api/admin/product/findBySpuId/.*'),
    method: 'get',
    response: () => successResponse([
        {
            id: 1001,
            skuName: '华为Mate60 黑色 128G',
            price: 5999,
            weight: '200',
            skuDefaultImg: 'https://img1.baidu.com/it/u=364488547,2216923041&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
        }
    ])
  }
] as MockMethod[]
