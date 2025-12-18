const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 10086;

// 中间件
app.use(cors());
app.use(express.json());

// 处理登录请求的函数
function handleLogin(req, res) {
  const { username, password } = req.body;

  if (username === 'admin' && password === '111111') {
    res.json({
      code: 200,
      data: 'This is Token...',
      message: 'success',
      ok: true
    });
  } else if (username === 'admin' && password !== '111111') {
    res.json({
      code: 204,
      data: null,
      message: '用户名或密码错误',
      ok: false
    });
  } else {
    res.json({
      code: 203,
      data: null,
      message: '用户名不存在',
      ok: false
    });
  }
}

// 处理用户信息的函数
function handleUserInfo(req, res) {
  res.json({
    code: 200,
    data: {
      userId: 1,
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'admin',
      name: '超级管理员',
      roles: ['平台管理员'],
      buttons: ['cuser.detail'],
      routes: ['home']
    },
    message: 'success',
    ok: true
  });
}

// 处理退出登录的函数
function handleLogout(req, res) {
  res.json({
    code: 200,
    data: null,
    message: '退出登录成功',
    ok: true
  });
}

// 处理用户分页列表的函数
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

  res.json({
    code: 200,
    data: {
      records: pageUsers,
      total: users.length,
      size: limit,
      current: page,
      pages: Math.ceil(users.length / limit)
    },
    message: 'success',
    ok: true
  });
}

// 处理文件上传的函数
function handleFileUpload(req, res) {
  res.json({
    code: 200,
    data: 'http://example.com/uploaded-file.jpg',
    message: '文件上传成功',
    ok: true
  });
}

// 直接访问的接口（兼容原有接口）
app.post('/admin/acl/index/login', handleLogin);
app.get('/admin/acl/index/info', handleUserInfo);
app.post('/admin/acl/index/logout', handleLogout);
app.get('/admin/acl/user/:page/:limit', handleUserList);
app.post('/admin/product/fileUpload', handleFileUpload);

// 带 /api 前缀的接口（前端通过代理访问）
app.post('/api/admin/acl/index/login', handleLogin);
app.get('/api/admin/acl/index/info', handleUserInfo);
app.post('/api/admin/acl/index/logout', handleLogout);
app.get('/api/admin/acl/user/:page/:limit', handleUserList);
app.post('/api/admin/product/fileUpload', handleFileUpload);

// 根路径，显示服务状态
app.get('/', (req, res) => {
  res.json({
    message: 'Vuepick Backend Server Running',
    endpoints: [
      'POST /admin/acl/index/login',
      'GET /admin/acl/index/info',
      'POST /admin/acl/index/logout',
      'GET /admin/acl/user/:page/:limit',
      'POST /admin/product/fileUpload'
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

// 重定向到 Swagger 页面
app.get('/swagger', (req, res) => {
  res.redirect('/swagger/index.html');
});

// 启动服务器
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Backend server running on http://127.0.0.1:${PORT}`);
  console.log(`API endpoints available:`);
  console.log(`  POST http://127.0.0.1:${PORT}/admin/acl/index/login`);
  console.log(`  POST http://127.0.0.1:${PORT}/api/admin/acl/index/login`);
  console.log(`  GET  http://127.0.0.1:${PORT}/admin/acl/user/1/5`);
});

module.exports = app;