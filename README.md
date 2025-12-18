# 硅谷甄选运营平台 (Vue3 + TypeScript + Golang)

这是一个基于 **Vue 3** + **Vite** + **TypeScript** 开发的后台管理系统前端，配合 **Golang** 实现的后端 API。项目实现了完整的用户权限管理（RBAC）、商品管理（SPU/SKU）、品牌管理等功能。

## ✨ 技术栈

- **前端**: Vue 3, Vite, TypeScript, Element Plus, Pinia, Axios
- **后端**: Golang (Gin 框架)
- **工具**: Docker (可选), ESLint, Prettier

---

## 🚀 快速开始

本项目包含前端和后端代码，建议按以下步骤分别启动：

### 1. 启动后端 API

后端代码位于 `backend` 目录下。

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 启动后端服务 (默认端口 10086)
npm start
API 地址: http://127.0.0.1:10086
Swagger 文档: http://127.0.0.1:10086/swagger/index.html#/
```

### 2. 启动前端项目

请在项目根目录下运行：

```bash
# 安装前端依赖
npm install

# 启动开发服务器
npm run dev
```

启动成功后，请访问控制台输出的地址 (通常是 `http://localhost:5173`)

### 🐳 Docker 一键启动 (可选)

```bash
# 需提前安装 Docker 和 Docker Compose
docker-compose up --build -d
```

---

## ⚙️ 项目配置

### 环境变量

前端配置位于 `.env.development` 文件中：

```properties
# 变量必须以 VITE_ 为前缀才能暴露给外部读取
NODE_ENV = 'development'
VITE_APP_TITLE = '硅谷甄选运营平台'
VITE_APP_BASE_API = '/api'

# 后端接口地址 (根据实际情况调整)
VITE_SERVE = 'http://127.0.0.1:10086'
```

### 开发工具推荐

- **IDE**: VS Code
- **插件**: Vue - Official (请禁用 Vetur)

---

## ⚠️ 开发注意事项 (与原版差异)

### 1. Token 验证与 Swagger
- 所有 API 接口均开启 Token 验证。
- **Swagger 测试步骤**:
  1. 先调用登录接口获取 Token
  2. 在 Swagger 头部配置 `Token: {获取的Token}`
- 默认账号: `admin` | 默认密码: `111111`

### 2. 文件上传组件
在使用 `<el-upload>` 上传文件时（如 `/admin/product/fileUpload`），**必须手动在 headers 中携带 Token**：

```html
<template>
  <el-upload 
    action="/admin/product/fileUpload" 
    :headers="headers"
  ></el-upload>
</template>

<script setup>
  import useUserStore from '@/store/modules/user'
  const userStore = useUserStore()
  const headers = { Token: userStore.token }
</script>
```

### 3. 数据类型转换
前端 `SaleAttr` 接口中的 `baseSaleAttrId` 字段后端定义为 `number` 类型，**提交前必须转为 Number**：

```typescript
// 强制转换为 Number 类型
let newSaleAttr: SaleAttr = {
  baseSaleAttrId: Number(baseSaleAttrId),
  saleAttrName,
  spuSaleAttrValueList: [],
}
```

### 4. 接口状态码处理
后端接口 **HTTP 状态码统一返回 200**，业务逻辑成功与否需判断 `response.data.code`：

```typescript
// utils/request.ts 拦截器逻辑
request.interceptors.response.use((response) => {
  const code = response.data.code
  if (code !== 200) {
    ElMessage({ type: 'error', message: response.data.message })
    return Promise.reject(new Error(response.data.message))
  }
  return response.data
})
```

---

## 📚 功能列表

### 🔐 权限管理 (ACL)
- 用户管理: 增删改查、分配角色
- 角色管理: 增删改查、分配权限
- 菜单管理: 动态路由、菜单权限配置

### 🛍️ 商品管理 (Product)
- 品牌管理: 品牌 CRUD、Logo 上传
- 属性管理: 平台属性规格设置
- SPU 管理: 标准产品单位管理（含图片墙、销售属性）
- SKU 管理: 库存量单位管理（上架/下架）

---

## 🤝 鸣谢
- 感谢 **尚硅谷** 与 **贾成豪老师** 提供的优质前端课程。
- 感谢原后端作者提供的 Golang API 参考。