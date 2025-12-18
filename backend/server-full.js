const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 10086;

// 中间件
app.use(cors());
app.use(express.json());

// 通用响应函数
function successResponse(data) {
  return {
    code: 200,
    message: '成功',
    ok: true,
    data: data
  };
}

// ==================== 用户管理接口 ====================

// 登录接口
app.post('/admin/acl/index/login', handleLogin);
app.post('/api/admin/acl/index/login', handleLogin);

function handleLogin(req, res) {
  const { username, password } = req.body;

  if (username === 'admin' && password === '111111') {
    res.json(successResponse('Admin Token Here'));
  } else if (username === 'admin' && password !== '111111') {
    res.json({ code: 204, data: null, message: '用户名或密码错误', ok: false });
  } else {
    res.json({ code: 203, data: null, message: '用户名不存在', ok: false });
  }
}

// 用户信息
app.get('/admin/acl/index/info', handleUserInfo);
app.get('/api/admin/acl/index/info', handleUserInfo);

function handleUserInfo(req, res) {
  res.json(successResponse({
    userId: 1,
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    username: 'admin',
    name: '超级管理员',
    roles: ['平台管理员'],
    buttons: ['cuser.detail'],
    routes: ['home']
  }));
}

// 退出登录
app.post('/admin/acl/index/logout', handleLogout);
app.post('/api/admin/acl/index/logout', handleLogout);

function handleLogout(req, res) {
  res.json(successResponse(null));
}

// 用户分页列表
app.get('/admin/acl/user/:page/:limit', handleUserList);
app.get('/api/admin/acl/user/:page/:limit', handleUserList);

function handleUserList(req, res) {
  const page = parseInt(req.params.page);
  const limit = parseInt(req.params.limit);

  const users = [];
  for (let i = 1; i <= 30; i++) {
    users.push({
      id: i,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2024-01-01 10:00:00',
      username: `user${i}`,
      name: `用户${i}`,
      phone: `1380013800${i}`,
      roleName: '管理员'
    });
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const pageUsers = users.slice(start, end);

  res.json(successResponse({
    records: pageUsers,
    total: users.length,
    size: limit,
    current: page,
    pages: Math.ceil(users.length / limit)
  }));
}

// ==================== 分类管理接口 ====================

// 创建一级分类数据
function createCategory1List() {
  return [
    { id: 1, name: '手机/数码' },
    { id: 2, name: '电脑/办公' },
    { id: 3, name: '家用电器' },
    { id: 4, name: '美妆护肤' },
    { id: 5, name: '服装鞋包' },
    { id: 6, name: '食品生鲜' },
    { id: 7, name: '家居家装' },
    { id: 8, name: '运动户外' }
  ];
}

// 获取一级分类
app.get('/admin/product/getCategory1', handleCategory1);
app.get('/api/admin/product/getCategory1', handleCategory1);

function handleCategory1(req, res) {
  res.json(successResponse(createCategory1List()));
}

// 获取二级分类
app.get('/admin/product/getCategory2', handleCategory2);
app.get('/api/admin/product/getCategory2', handleCategory2);

function handleCategory2(req, res) {
  const category1Id = parseInt(req.query.category1Id);
  const category2Map = {
    1: [{ id: 11, name: '手机' }, { id: 12, name: '手机配件' }, { id: 13, name: '相机' }],
    2: [{ id: 21, name: '笔记本' }, { id: 22, name: '台式机' }, { id: 23, name: '办公设备' }],
    3: [{ id: 31, name: '电视' }, { id: 32, name: '空调' }, { id: 33, name: '冰箱' }]
  };
  res.json(successResponse(category2Map[category1Id] || []));
}

// 获取三级分类
app.get('/admin/product/getCategory3', handleCategory3);
app.get('/api/admin/product/getCategory3', handleCategory3);

function handleCategory3(req, res) {
  const category2Id = parseInt(req.query.category2Id);
  const category3Map = {
    11: [{ id: 111, name: '智能手机' }, { id: 112, name: '老人机' }],
    21: [{ id: 211, name: '游戏本' }, { id: 212, name: '轻薄本' }],
    31: [{ id: 311, name: '液晶电视' }, { id: 312, name: 'OLED电视' }]
  };
  res.json(successResponse(category3Map[category2Id] || []));
}

// ==================== 品牌管理接口 ====================

// 品牌列表
app.get('/admin/product/baseTrademark/', handleTrademarkList);
app.get('/api/admin/product/baseTrademark/', handleTrademarkList);

function handleTrademarkList(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const trademarks = [
    { id: 1, tmName: '小米', logoUrl: 'https://example.com/xiaomi.png' },
    { id: 2, tmName: '华为', logoUrl: 'https://example.com/huawei.png' },
    { id: 3, tmName: '苹果', logoUrl: 'https://example.com/apple.png' },
    { id: 4, tmName: '三星', logoUrl: 'https://example.com/samsung.png' },
    { id: 5, tmName: 'OPPO', logoUrl: 'https://example.com/oppo.png' }
  ];

  const start = (parseInt(page) - 1) * parseInt(limit);
  const end = start + parseInt(limit);
  const list = trademarks.slice(start, end);

  res.json(successResponse({
    records: list,
    total: trademarks.length,
    size: parseInt(limit),
    current: parseInt(page),
    pages: Math.ceil(trademarks.length / parseInt(limit))
  }));
}

// 获取品牌列表（用于SPU）
app.get('/admin/product/baseTrademark/getTrademarkList', handleTrademarkListForSpu);
app.get('/api/admin/product/baseTrademark/getTrademarkList', handleTrademarkListForSpu);

function handleTrademarkListForSpu(req, res) {
  res.json(successResponse([
    { id: 1, tmName: '华为', logoUrl: 'http://dummyimage.com/100x100' },
    { id: 2, tmName: '苹果', logoUrl: 'http://dummyimage.com/100x100' },
    { id: 3, tmName: '小米', logoUrl: 'http://dummyimage.com/100x100' }
  ]));
}

// ==================== SPU管理接口 ====================

// SPU列表
app.get('/admin/product/:page/:limit', handleSpuList);
app.get('/api/admin/product/:page/:limit', handleSpuList);

function handleSpuList(req, res) {
  res.json(successResponse({
    records: [
      {
        id: 1,
        spuName: '华为Mate60',
        description: '遥遥领先',
        category3Id: 111,
        tmId: 1,
        spuSaleAttrList: null,
        spuImageList: null,
      },
      {
        id: 2,
        spuName: 'iPhone 15',
        description: '苹果手机',
        category3Id: 111,
        tmId: 2,
        spuSaleAttrList: null,
        spuImageList: null,
      },
      {
        id: 3,
        spuName: '小米14',
        description: '徕卡影像',
        category3Id: 111,
        tmId: 3,
        spuSaleAttrList: null,
        spuImageList: null,
      }
    ],
    total: 10,
    size: 3,
    current: 1,
    pages: 4,
  }));
}

// SPU图片列表
app.get('/admin/product/spuImageList/:spuId', handleSpuImageList);
app.get('/api/admin/product/spuImageList/:spuId', handleSpuImageList);

function handleSpuImageList(req, res) {
  res.json(successResponse([
    { id: 1, imgName: '正面图', imgUrl: 'https://img1.baidu.com/it/u=364488547,2216923041&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' },
    { id: 2, imgName: '背面图', imgUrl: 'https://img2.baidu.com/it/u=2983920986,3520767603&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' }
  ]));
}

// SPU销售属性
app.get('/admin/product/spuSaleAttrList/:spuId', handleSpuSaleAttrList);
app.get('/api/admin/product/spuSaleAttrList/:spuId', handleSpuSaleAttrList);

function handleSpuSaleAttrList(req, res) {
  res.json(successResponse([
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
    }
  ]));
}

// 基础销售属性
app.get('/admin/product/baseSaleAttrList', handleBaseSaleAttrList);
app.get('/api/admin/product/baseSaleAttrList', handleBaseSaleAttrList);

function handleBaseSaleAttrList(req, res) {
  res.json(successResponse([
    { id: 1, name: '颜色' },
    { id: 2, name: '版本' },
    { id: 3, name: '尺码' }
  ]));
}

// ==================== 属性管理接口 ====================

// 属性列表
app.get('/admin/product/attrInfoList', handleAttrList);
app.get('/api/admin/product/attrInfoList', handleAttrList);

function handleAttrList(req, res) {
  const { category1Id, category2Id, category3Id } = req.query;
  res.json(successResponse([
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
  ]));
}

// 根据分类获取属性
app.get('/admin/product/attrInfoList/:category3Id', handleAttrByCategory);
app.get('/api/admin/product/attrInfoList/:category3Id', handleAttrByCategory);

function handleAttrByCategory(req, res) {
  res.json(successResponse([
    {
      id: 1,
      attrName: '操作系统',
      attrValueList: [
        { id: 101, valueName: 'Android' },
        { id: 102, valueName: 'iOS' },
      ]
    }
  ]));
}

// ==================== SKU管理接口 ====================

// 根据SPU获取SKU列表
app.get('/admin/product/findBySpuId/:spuId', handleSkuList);
app.get('/api/admin/product/findBySpuId/:spuId', handleSkuList);

function handleSkuList(req, res) {
  res.json(successResponse([
    {
      id: 1001,
      skuName: '华为Mate60 黑色 128G',
      price: 5999,
      weight: '200',
      skuDefaultImg: 'https://img1.baidu.com/it/u=364488547,2216923041&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
    }
  ]));
}

// ==================== 文件上传接口 ====================

app.post('/admin/product/fileUpload', handleFileUpload);
app.post('/api/admin/product/fileUpload', handleFileUpload);

function handleFileUpload(req, res) {
  res.json(successResponse('http://example.com/uploaded-file.jpg'));
}

// ==================== 预外接口 ====================

// 保存/更新SPU
app.post('/admin/product/saveSpuInfo', (req, res) => res.json(successResponse(null)));
app.post('/api/admin/product/saveSpuInfo', (req, res) => res.json(successResponse(null)));
app.post('/admin/product/updateSpuInfo', (req, res) => res.json(successResponse(null)));
app.post('/api/admin/product/updateSpuInfo', (req, res) => res.json(successResponse(null)));

// 删除SPU
app.delete('/admin/product/deleteSpu/:spuId', (req, res) => res.json(successResponse(null)));
app.delete('/api/admin/product/deleteSpu/:spuId', (req, res) => res.json(successResponse(null)));

// 保存SKU
app.post('/admin/product/saveSkuInfo', (req, res) => res.json(successResponse(null)));
app.post('/api/admin/product/saveSkuInfo', (req, res) => res.json(successResponse(null)));

// 保存/更新品牌
app.post('/admin/product/baseTrademark/save', (req, res) => res.json(successResponse({ id: Date.now() })));
app.post('/api/admin/product/baseTrademark/save', (req, res) => res.json(successResponse({ id: Date.now() })));
app.put('/admin/product/baseTrademark/update', (req, res) => res.json(successResponse(null)));
app.put('/api/admin/product/baseTrademark/update', (req, res) => res.json(successResponse(null)));

// 删除品牌
app.delete('/admin/product/baseTrademark/remove/:id', (req, res) => res.json(successResponse(null)));
app.delete('/api/admin/product/baseTrademark/remove/:id', (req, res) => res.json(successResponse(null)));

// 保存/更新属性
app.post('/admin/product/saveAttrInfo', (req, res) => res.json(successResponse({ id: Date.now() })));
app.post('/api/admin/product/saveAttrInfo', (req, res) => res.json(successResponse({ id: Date.now() })));
app.put('/admin/product/updateAttrInfo', (req, res) => res.json(successResponse(null)));
app.put('/api/admin/product/updateAttrInfo', (req, res) => res.json(successResponse(null)));

// 删除属性
app.delete('/admin/product/deleteAttr/:attrId', (req, res) => res.json(successResponse(null)));
app.delete('/api/admin/product/deleteAttr/:attrId', (req, res) => res.json(successResponse(null)));

// 删除属性值
app.delete('/admin/product/deleteAttrValue', (req, res) => res.json(successResponse(null)));
app.delete('/api/admin/product/deleteAttrValue', (req, res) => res.json(successResponse(null)));

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: 'Vuepick Backend Server Running',
    endpoints: [
      '用户管理: /admin/acl/*',
      '分类管理: /admin/product/getCategory*',
      '品牌管理: /admin/product/baseTrademark/*',
      'SPU管理: /admin/product/{page}/{limit}',
      '属性管理: /admin/product/attrInfoList',
      'SKU管理: /admin/product/findBySpuId/*',
      '文件上传: /admin/product/fileUpload'
    ]
  });
});

// Swagger 文档页面
app.get('/swagger/index.html', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const swaggerPath = path.join(__dirname, 'swagger.html');
  res.sendFile(swaggerPath);
});

// 启动服务器
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Backend server running on http://127.0.0.1:${PORT}`);
  console.log(`📖 Swagger: http://127.0.0.1:${PORT}/swagger/index.html`);
  console.log(`✅ API endpoints available for both /admin and /api prefixes`);
});

module.exports = app;