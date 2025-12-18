const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 10086;

// 中间件
app.use(cors());
app.use(express.json());

// 登录接口
app.post('/admin/acl/index/login', (req, res) => {
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
});

// 用户信息接口
app.get('/admin/acl/index/info', (req, res) => {
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
});

// 退出登录
app.post('/admin/acl/index/logout', (req, res) => {
  res.json({
    code: 200,
    data: null,
    message: '退出登录成功',
    ok: true
  });
});

// 用户分页列表
app.get('/admin/acl/user/:page/:limit', (req, res) => {
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
});

// 文件上传接口
app.post('/admin/product/fileUpload', (req, res) => {
  res.json({
    code: 200,
    data: 'http://example.com/uploaded-file.jpg',
    message: '文件上传成功',
    ok: true
  });
});

// 启动服务器
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Backend server running on http://127.0.0.1:${PORT}`);
  console.log(`Swagger available at: http://127.0.0.1:${PORT}/swagger/index.html`);
});

module.exports = app;