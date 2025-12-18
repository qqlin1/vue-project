const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 10086;

// 中间件
app.use(cors());
app.use(express.json());

// 通用响应函数
function successResponse(data, message = '成功') {
  return {
    code: 200,
    message: message,
    ok: true,
    data: data
  };
}

// ==================== 后台登录与用户信息 ====================

// 登录接口
app.post('/admin/acl/index/login', handleLogin);
app.post('/api/admin/acl/index/login', handleLogin);

function handleLogin(req, res) {
  const { username, password } = req.body;

  if (username === 'admin' && password === '111111') {
    res.json(successResponse('Admin Token Here', '登录成功'));
  } else if (username === 'system' && password === '111111') {
    res.json(successResponse('System Token Here', '登录成功'));
  } else if (username === 'admin' && password !== '111111') {
    res.json({ code: 204, data: null, message: '用户名或密码错误', ok: false });
  } else {
    res.json({ code: 203, data: null, message: '用户名不存在', ok: false });
  }
}

// 登出接口
app.post('/admin/acl/index/logout', handleLogout);
app.post('/api/admin/acl/index/logout', handleLogout);

function handleLogout(req, res) {
  res.json(successResponse(null, '退出登录成功'));
}

// 用户信息接口
app.get('/admin/acl/index/info', handleUserInfo);
app.get('/api/admin/acl/index/info', handleUserInfo);

function handleUserInfo(req, res) {
  // 根据token返回不同用户信息
  const token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');

  if (token === 'System Token Here') {
    res.json(successResponse({
      userId: 2,
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'system',
      name: '系统管理员',
      roles: ['系统管理员'],
      buttons: ['cuser.detail', 'cuser.user'],
      routes: ['home']
    }, '获取用户信息成功'));
  } else {
    res.json(successResponse({
      userId: 1,
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'admin',
      name: '超级管理员',
      roles: ['平台管理员'],
      buttons: ['cuser.detail'],
      routes: ['home']
    }, '获取用户信息成功'));
  }
}

// ==================== 菜单管理 ====================

// 持久化权限数据
let permissions = [
  {
    id: 1,
    pid: 0,
    title: '首页',
    name: 'Home',
    icon: 'House',
    path: '/home',
    component: 'Home',
    perms: '',
    createTime: '2023-12-01 10:00:00',
    updateTime: '2023-12-01 10:00:00'
  },
  {
    id: 2,
    pid: 0,
    title: '商品管理',
    name: 'Product',
    icon: 'Goods',
    path: '/product',
    component: 'Layout',
    perms: '',
    createTime: '2023-12-01 10:00:00',
    updateTime: '2023-12-01 10:00:00',
    children: [
      {
        id: 3,
        pid: 2,
        title: '品牌管理',
        name: 'Trademark',
        icon: 'Star',
        path: '/product/trademark',
        component: 'product/Trademark',
        perms: 'btn.Trademark.list',
        createTime: '2023-12-01 10:00:00',
        updateTime: '2023-12-01 10:00:00'
      },
      {
        id: 4,
        pid: 2,
        title: '属性管理',
        name: 'Attr',
        icon: 'Setting',
        path: '/product/attr',
        component: 'product/Attr',
        perms: 'btn.Attr.list',
        createTime: '2023-12-01 10:00:00',
        updateTime: '2023-12-01 10:00:00'
      },
      {
        id: 5,
        pid: 2,
        title: 'SPU管理',
        name: 'Spu',
        icon: 'Box',
        path: '/product/spu',
        component: 'product/Spu',
        perms: 'btn.Spu.list',
        createTime: '2023-12-01 10:00:00',
        updateTime: '2023-12-01 10:00:00'
      },
      {
        id: 6,
        pid: 2,
        title: 'SKU管理',
        name: 'Sku',
        icon: 'GoodsFilled',
        path: '/product/sku',
        component: 'product/Sku',
        perms: 'btn.Sku.list',
        createTime: '2023-12-01 10:00:00',
        updateTime: '2023-12-01 10:00:00'
      }
    ]
  },
  {
    id: 7,
    pid: 0,
    title: '权限管理',
    name: 'Acl',
    icon: 'Lock',
    path: '/acl',
    component: 'Layout',
    perms: '',
    createTime: '2023-12-01 10:00:00',
    updateTime: '2023-12-01 10:00:00',
    children: [
      {
        id: 8,
        pid: 7,
        title: '角色管理',
        name: 'Role',
        icon: 'UserFilled',
        path: '/acl/role',
        component: 'acl/Role',
        perms: 'btn.Role.list',
        createTime: '2023-12-01 10:00:00',
        updateTime: '2023-12-01 10:00:00'
      },
      {
        id: 9,
        pid: 7,
        title: '菜单管理',
        name: 'Permission',
        icon: 'Menu',
        path: '/acl/permission',
        component: 'acl/Permission',
        perms: 'btn.Permission.list',
        createTime: '2023-12-01 10:00:00',
        updateTime: '2023-12-01 10:00:00'
      },
      {
        id: 10,
        pid: 7,
        title: '用户管理',
        name: 'User',
        icon: 'User',
        path: '/acl/user',
        component: 'acl/User',
        perms: 'btn.User.list',
        createTime: '2023-12-01 10:00:00',
        updateTime: '2023-12-01 10:00:00'
      }
    ]
  }
];

// 递归函数：将平铺的权限列表转换为树形结构
function buildPermissionTree(permissionList, pid = 0) {
  const tree = [];
  for (const permission of permissionList) {
    if (permission.pid === pid) {
      const children = buildPermissionTree(permissionList, permission.id);
      if (children.length > 0) {
        permission.children = children;
      }
      tree.push(permission);
    }
  }
  return tree;
}

// 递归函数：在权限列表中查找指定ID的权限
function findPermissionById(permissionList, id) {
  for (const permission of permissionList) {
    if (permission.id === id) {
      return permission;
    }
    if (permission.children) {
      const found = findPermissionById(permission.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

// 递归函数：将树形结构的权限列表转换为平铺列表
function flattenPermissions(permissionList) {
  let flatList = [];
  for (const permission of permissionList) {
    // 复制权限对象，不包含children
    const { children, ...permissionWithoutChildren } = permission;
    flatList.push(permissionWithoutChildren);
    if (children) {
      flatList = flatList.concat(flattenPermissions(children));
    }
  }
  return flatList;
}

// 获取菜单列表接口
app.get('/admin/acl/permission', handlePermissionList);
app.get('/api/admin/acl/permission', handlePermissionList);

function handlePermissionList(req, res) {
  // 由于我们已经存储了树形结构，直接返回即可
  res.json(successResponse(permissions));
}

// 角色分配权限接口
app.post('/admin/acl/permission/doAssign', handleAssignPermission);
app.post('/api/admin/acl/permission/doAssign', handleAssignPermission);

function handleAssignPermission(req, res) {
  const { roleId, permissionIdList } = req.body;
  res.json(successResponse(null, '分配权限成功'));
}

// 删除菜单接口
app.delete('/admin/acl/permission/remove/:id', handleRemovePermission);
app.delete('/api/admin/acl/permission/remove/:id', handleRemovePermission);

function handleRemovePermission(req, res) {
  const { id } = req.params;
  const permissionId = parseInt(id);

  // 递归函数：删除指定ID的权限
  function removePermission(permissionList) {
    for (let i = 0; i < permissionList.length; i++) {
      if (permissionList[i].id === permissionId) {
        permissionList.splice(i, 1);
        return true;
      }
      if (permissionList[i].children) {
        const found = removePermission(permissionList[i].children);
        if (found) {
          // 如果删除了子权限后，父权限没有子权限了，移除children属性
          if (permissionList[i].children.length === 0) {
            delete permissionList[i].children;
          }
          return true;
        }
      }
    }
    return false;
  }

  const found = removePermission(permissions);
  if (found) {
    res.json(successResponse(null, '删除菜单成功'));
  } else {
    res.json({ code: 404, data: null, message: '菜单不存在', ok: false });
  }
}

// 新增菜单接口
app.post('/admin/acl/permission/save', handleSavePermission);
app.post('/api/admin/acl/permission/save', handleSavePermission);

function handleSavePermission(req, res) {
  const newPermission = req.body;
  // 生成新的权限ID
  const newId = Date.now();
  // 设置创建和更新时间
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  // 构建完整的权限对象
  const permissionToAdd = {
    id: newId,
    pid: newPermission.pid || 0,
    title: newPermission.title,
    name: newPermission.name,
    icon: newPermission.icon || '',
    path: newPermission.path || '',
    component: newPermission.component || '',
    perms: newPermission.perms || '',
    createTime: now,
    updateTime: now
  };

  // 如果是根权限，直接添加到权限列表
  if (permissionToAdd.pid === 0) {
    permissions.push(permissionToAdd);
  } else {
    // 否则，查找父权限并添加到其子权限中
    function addChildPermission(permissionList) {
      for (const permission of permissionList) {
        if (permission.id === permissionToAdd.pid) {
          if (!permission.children) {
            permission.children = [];
          }
          permission.children.push(permissionToAdd);
          return true;
        }
        if (permission.children) {
          const found = addChildPermission(permission.children);
          if (found) {
            return true;
          }
        }
      }
      return false;
    }

    addChildPermission(permissions);
  }

  res.json(successResponse({ id: newId }, '新增菜单成功'));
}

// 根据角色获取菜单接口
app.get('/admin/acl/permission/toAssign/:roleId', handleToAssignPermission);
app.get('/api/admin/acl/permission/toAssign/:roleId', handleToAssignPermission);

function handleToAssignPermission(req, res) {
  res.json(successResponse([
    { id: 1, name: 'btn.Trademark.list', selected: true },
    { id: 2, name: 'btn.Attr.list', selected: true },
    { id: 3, name: 'btn.Spu.list', selected: false },
    { id: 4, name: 'btn.Sku.list', selected: false }
  ]));
}

// 更新菜单接口
app.put('/admin/acl/permission/update', handleUpdatePermission);
app.put('/api/admin/acl/permission/update', handleUpdatePermission);

function handleUpdatePermission(req, res) {
  const updatedPermission = req.body;
  // 转换id为数字类型，解决类型不匹配问题
  const updateId = typeof updatedPermission.id === 'string' ? parseInt(updatedPermission.id) : updatedPermission.id;
  // 查找要更新的权限
  const permission = findPermissionById(permissions, updateId);

  if (permission) {
    // 更新权限信息
    Object.assign(permission, updatedPermission);
    permission.id = updateId; // 确保id是数字类型
    permission.updateTime = new Date().toISOString().replace('T', ' ').slice(0, 19);
    res.json(successResponse(null, '更新菜单成功'));
  } else {
    res.json({ code: 404, data: null, message: '菜单不存在', ok: false });
  }
}

// ==================== 角色管理 ====================

// 持久化角色数据
let roles = [
  { id: 1, roleName: '超级管理员', createTime: '2023-12-01 10:00:00', updateTime: '2023-12-01 10:00:00', roleKey: 'admin' },
  { id: 2, roleName: '普通管理员', createTime: '2023-12-01 10:00:00', updateTime: '2023-12-01 10:00:00', roleKey: 'manager' },
  { id: 3, roleName: '运营专员', createTime: '2023-12-01 10:00:00', updateTime: '2023-12-01 10:00:00', roleKey: 'operator' }
];

// 获取角色分页列表
app.get('/admin/acl/role/:page/:limit', handleRoleList);
app.get('/api/admin/acl/role/:page/:limit', handleRoleList);

function handleRoleList(req, res) {
  const page = parseInt(req.params.page);
  const limit = parseInt(req.params.limit);

  const start = (page - 1) * limit;
  const end = start + limit;
  const pageRoles = roles.slice(start, end);

  res.json(successResponse({
    records: pageRoles,
    total: roles.length,
    size: limit,
    current: page,
    pages: Math.ceil(roles.length / limit)
  }));
}

// 新增角色接口
app.post('/admin/acl/role/save', handleSaveRole);
app.post('/api/admin/acl/role/save', handleSaveRole);

function handleSaveRole(req, res) {
  const newRole = req.body;
  // 生成新的角色ID
  const newId = Date.now();
  // 设置创建和更新时间
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  // 构建完整的角色对象
  const roleToAdd = {
    id: newId,
    createTime: now,
    updateTime: now,
    roleName: newRole.roleName,
    roleKey: newRole.roleKey
  };
  // 将新角色添加到持久化数组
  roles.push(roleToAdd);
  res.json(successResponse({ id: newId }, '新增角色成功'));
}

// 更新角色接口
app.put('/admin/acl/role/update', handleUpdateRole);
app.put('/api/admin/acl/role/update', handleUpdateRole);

function handleUpdateRole(req, res) {
  const updatedRole = req.body;
  // 转换id为数字类型，解决类型不匹配问题
  const updateId = typeof updatedRole.id === 'string' ? parseInt(updatedRole.id) : updatedRole.id;
  // 查找要更新的角色索引
  const roleIndex = roles.findIndex(role => role.id === updateId);
  if (roleIndex !== -1) {
    // 更新角色信息
    roles[roleIndex] = {
      ...roles[roleIndex],
      ...updatedRole,
      id: updateId, // 确保id是数字类型
      updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    res.json(successResponse(null, '更新角色成功'));
  } else {
    res.json({ code: 404, data: null, message: '角色不存在', ok: false });
  }
}

// 删除角色接口
app.delete('/admin/acl/role/remove/:id', handleRemoveRole);
app.delete('/api/admin/acl/role/remove/:id', handleRemoveRole);

function handleRemoveRole(req, res) {
  const { id } = req.params;
  const roleId = parseInt(id);
  // 查找要删除的角色索引
  const roleIndex = roles.findIndex(role => role.id === roleId);
  if (roleIndex !== -1) {
    // 从数组中删除角色
    roles.splice(roleIndex, 1);
    res.json(successResponse(null, '删除角色成功'));
  } else {
    res.json({ code: 404, data: null, message: '角色不存在', ok: false });
  }
}

// ==================== 用户管理 ====================

// 持久化用户数据
let users = [];
// 初始化用户数据
for (let i = 1; i <= 30; i++) {
  users.push({
    id: i,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
    username: `user${i}`,
    name: `用户${i}`,
    phone: `1380013800${i}`,
    roleName: i % 2 === 0 ? '管理员' : '普通用户'
  });
}

// 获取用户分页列表
app.get('/admin/acl/user/:page/:limit', handleUserList);
app.get('/api/admin/acl/user/:page/:limit', handleUserList);

function handleUserList(req, res) {
  const page = parseInt(req.params.page);
  const limit = parseInt(req.params.limit);

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

// 用户新增接口
app.post('/admin/acl/user/save', handleSaveUser);
app.post('/api/admin/acl/user/save', handleSaveUser);

function handleSaveUser(req, res) {
  const newUser = req.body;
  // 生成新的用户ID
  const newId = Date.now();
  // 设置创建和更新时间
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  // 构建完整的用户对象
  const userToAdd = {
    id: newId,
    createTime: now,
    updateTime: now,
    username: newUser.username,
    name: newUser.name,
    password: newUser.password,
    phone: newUser.phone || null,
    roleName: newUser.roleName || '普通用户'
  };
  // 将新用户添加到持久化数组
  users.push(userToAdd);
  res.json(successResponse({ id: newId }, '新增用户成功'));
}

// 更新用户接口
app.put('/admin/acl/user/update', handleUpdateUser);
app.put('/api/admin/acl/user/update', handleUpdateUser);

function handleUpdateUser(req, res) {
  console.log('handleUpdateUser - 收到请求:', req.body);
  console.log('handleUpdateUser - 请求头:', req.headers);

  const updatedUser = req.body;
  console.log('handleUpdateUser - 更新用户数据:', updatedUser);
  console.log('handleUpdateUser - id类型:', typeof updatedUser.id);

  // 转换id为数字类型，解决类型不匹配问题
  const updateId = typeof updatedUser.id === 'string' ? parseInt(updatedUser.id) : updatedUser.id;
  console.log('handleUpdateUser - 转换后的id:', updateId);
  console.log('handleUpdateUser - 转换后id类型:', typeof updateId);

  // 查看所有用户，方便调试
  console.log('handleUpdateUser - 所有用户:', users);

  // 查找要更新的用户索引
  const userIndex = users.findIndex(user => {
    console.log('比较用户id:', user.id, '和更新id:', updateId, '结果:', user.id === updateId);
    return user.id === updateId;
  });
  console.log('handleUpdateUser - 找到的用户索引:', userIndex);

  if (userIndex !== -1) {
    // 更新用户信息
    users[userIndex] = {
      ...users[userIndex],
      ...updatedUser,
      id: updateId, // 确保id是数字类型
      updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    console.log('handleUpdateUser - 更新后的用户:', users[userIndex]);
    res.json(successResponse(null, '更新用户成功'));
  } else {
    console.log('handleUpdateUser - 用户不存在，更新失败');
    res.json({ code: 404, data: null, message: '用户不存在，更新失败', ok: false });
  }
}

// 删除用户接口
app.delete('/admin/acl/user/remove/:id', handleRemoveUser);
app.delete('/api/admin/acl/user/remove/:id', handleRemoveUser);

function handleRemoveUser(req, res) {
  const { id } = req.params;
  const userId = parseInt(id);
  // 查找要删除的用户索引
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    // 从数组中删除用户
    users.splice(userIndex, 1);
    res.json(successResponse(null, '删除用户成功'));
  } else {
    res.json({ code: 404, data: null, message: '用户不存在', ok: false });
  }
}

// 批量删除用户接口
app.delete('/admin/acl/user/batchRemove', handleBatchRemoveUser);
app.delete('/api/admin/acl/user/batchRemove', handleBatchRemoveUser);

function handleBatchRemoveUser(req, res) {
  const { idList } = req.body;
  console.log('handleBatchRemoveUser - 收到批量删除请求:', idList);
  
  if (!idList || idList.length === 0) {
    res.json(successResponse(null, '没有要删除的用户'));
    return;
  }
  
  // 转换id为数字类型
  const numericIdList = idList.map(id => typeof id === 'string' ? parseInt(id) : id);
  console.log('handleBatchRemoveUser - 转换后的ID列表:', numericIdList);
  
  // 过滤掉不在ID列表中的用户，实现批量删除
  const initialLength = users.length;
  users = users.filter(user => !numericIdList.includes(user.id));
  const deletedCount = initialLength - users.length;
  
  console.log('handleBatchRemoveUser - 删除前用户数:', initialLength);
  console.log('handleBatchRemoveUser - 删除后用户数:', users.length);
  console.log('handleBatchRemoveUser - 实际删除用户数:', deletedCount);
  
  res.json(successResponse(null, `批量删除${deletedCount}个用户成功`));
}

// 用户角色分配接口
app.get('/admin/acl/user/toAssign/:adminId', handleToAssignRole);
app.get('/api/admin/acl/user/toAssign/:adminId', handleToAssignRole);

function handleToAssignRole(req, res) {
  res.json(successResponse([
    { id: 1, roleName: '超级管理员', selected: true },
    { id: 2, roleName: '普通管理员', selected: false }
  ]));
}

// 用户分配角色接口
app.post('/admin/acl/user/doAssignRole', handleDoAssignRole);
app.post('/api/admin/acl/user/doAssignRole', handleDoAssignRole);

function handleDoAssignRole(req, res) {
  const { adminId, roleIdList } = req.body;
  res.json(successResponse(null, '分配角色成功'));
}

// ==================== 商品基础属性接口 ====================

// 获取分类下已有的属性与属性值接口
app.get('/admin/product/attrInfoList/:c1Id/:c2Id/:c3Id', handleAttrListByCategory);
app.get('/api/admin/product/attrInfoList/:c1Id/:c2Id/:c3Id', handleAttrListByCategory);

function handleAttrListByCategory(req, res) {
  const { c1Id, c2Id, c3Id } = req.params;
  res.json(successResponse([
    {
      id: 1,
      attrName: '颜色',
      attrValueList: [
        { id: 101, valueName: '黑色' },
        { id: 102, valueName: '白色' },
        { id: 103, valueName: '红色' }
      ]
    },
    {
      id: 2,
      attrName: '版本',
      attrValueList: [
        { id: 201, valueName: '标准版' },
        { id: 202, valueName: 'Pro版' },
        { id: 203, valueName: 'Max版' }
      ]
    }
  ]));
}

// 添加或者修改已有的属性
app.post('/admin/product/saveAttrInfo', handleSaveAttrInfo);
app.post('/api/admin/product/saveAttrInfo', handleSaveAttrInfo);

function handleSaveAttrInfo(req, res) {
  res.json(successResponse({ id: Date.now() }, '保存属性成功'));
}

// 删除基础属性接口
app.delete('/admin/product/deleteAttr/:attrId', handleDeleteAttr);
app.delete('/api/admin/product/deleteAttr/:attrId', handleDeleteAttr);

function handleDeleteAttr(req, res) {
  res.json(successResponse(null, '删除属性成功'));
}

// ==================== 品牌管理 ====================

// 获取品牌分页列表接口
app.get('/admin/product/baseTrademark/:page/:limit', handleTrademarkPageList);
app.get('/api/admin/product/baseTrademark/:page/:limit', handleTrademarkPageList);

function handleTrademarkPageList(req, res) {
  const page = parseInt(req.params.page);
  const limit = parseInt(req.params.limit);

  const trademarks = [
    { id: 1, tmName: '小米', logoUrl: 'https://example.com/xiaomi.png' },
    { id: 2, tmName: '华为', logoUrl: 'https://example.com/huawei.png' },
    { id: 3, tmName: '苹果', logoUrl: 'https://example.com/apple.png' },
    { id: 4, tmName: '三星', logoUrl: 'https://example.com/samsung.png' },
    { id: 5, tmName: 'OPPO', logoUrl: 'https://example.com/oppo.png' }
  ];

  const start = (page - 1) * limit;
  const end = start + limit;
  const list = trademarks.slice(start, end);

  res.json(successResponse({
    records: list,
    total: trademarks.length,
    size: limit,
    current: page,
    pages: Math.ceil(trademarks.length / limit)
  }));
}

// 获取全部品牌数据
app.get('/admin/product/baseTrademark/getTrademarkList', handleTrademarkAllList);
app.get('/api/admin/product/baseTrademark/getTrademarkList', handleTrademarkAllList);

function handleTrademarkAllList(req, res) {
  res.json(successResponse([
    { id: 1, tmName: '华为', logoUrl: 'http://dummyimage.com/100x100' },
    { id: 2, tmName: '苹果', logoUrl: 'http://dummyimage.com/100x100' },
    { id: 3, tmName: '小米', logoUrl: 'http://dummyimage.com/100x100' }
  ]));
}

// 新增品牌接口
app.post('/admin/product/baseTrademark/save', handleSaveTrademark);
app.post('/api/admin/product/baseTrademark/save', handleSaveTrademark);

function handleSaveTrademark(req, res) {
  res.json(successResponse({ id: Date.now() }, '新增品牌成功'));
}

// 更新品牌接口
app.put('/admin/product/baseTrademark/update', handleUpdateTrademark);
app.put('/api/admin/product/baseTrademark/update', handleUpdateTrademark);

function handleUpdateTrademark(req, res) {
  res.json(successResponse(null, '更新品牌成功'));
}

// 删除品牌接口
app.delete('/admin/product/baseTrademark/remove/:id', handleRemoveTrademark);
app.delete('/api/admin/product/baseTrademark/remove/:id', handleRemoveTrademark);

function handleRemoveTrademark(req, res) {
  res.json(successResponse(null, '删除品牌成功'));
}

// ==================== 上传文件 ====================

// 上传文件接口
app.post('/admin/product/fileUpload', handleFileUpload);
app.post('/api/admin/product/fileUpload', handleFileUpload);

function handleFileUpload(req, res) {
  res.json(successResponse('http://example.com/uploaded-file.jpg', '文件上传成功'));
}

// ==================== 商品分类接口 ====================

// 获取一级分类接口
app.get('/admin/product/getCategory1', handleCategory1);
app.get('/api/admin/product/getCategory1', handleCategory1);

function handleCategory1(req, res) {
  res.json(successResponse([
    { id: 1, name: '手机/数码' },
    { id: 2, name: '电脑/办公' },
    { id: 3, name: '家用电器' },
    { id: 4, name: '美妆护肤' }
  ]));
}

// 获取二级分类接口
app.get('/admin/product/getCategory2/:id', handleCategory2);
app.get('/api/admin/product/getCategory2/:id', handleCategory2);

function handleCategory2(req, res) {
  const { id } = req.params;
  const category2Map = {
    1: [{ id: 11, name: '手机' }, { id: 12, name: '相机' }],
    2: [{ id: 21, name: '笔记本' }, { id: 22, name: '台式机' }],
    3: [{ id: 31, name: '电视' }, { id: 32, name: '空调' }]
  };
  res.json(successResponse(category2Map[id] || []));
}

// 获取三级分类接口
app.get('/admin/product/getCategory3/:id', handleCategory3);
app.get('/api/admin/product/getCategory3/:id', handleCategory3);

function handleCategory3(req, res) {
  const { id } = req.params;
  const category3Map = {
    11: [{ id: 111, name: '智能手机' }, { id: 112, name: '老人机' }],
    21: [{ id: 211, name: '游戏本' }, { id: 212, name: '轻薄本' }],
    31: [{ id: 311, name: '液晶电视' }, { id: 312, name: 'OLED电视' }]
  };
  res.json(successResponse(category3Map[id] || []));
}

// ==================== 商品 SPU 接口 ====================

// 获取SPU分页列表
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
      }
    ],
    total: 10,
    size: 3,
    current: 1,
    pages: 4,
  }));
}

// 获取全部销售属性
app.get('/admin/product/baseSaleAttrList', handleBaseSaleAttrList);
app.get('/api/admin/product/baseSaleAttrList', handleBaseSaleAttrList);

function handleBaseSaleAttrList(req, res) {
  res.json(successResponse([
    { id: 1, name: '颜色' },
    { id: 2, name: '版本' },
    { id: 3, name: '内存' }
  ]));
}

// 新增SPU
app.post('/admin/product/saveSpuInfo', handleSaveSpuInfo);
app.post('/api/admin/product/saveSpuInfo', handleSaveSpuInfo);

function handleSaveSpuInfo(req, res) {
  res.json(successResponse({ id: Date.now() }, '新增SPU成功'));
}

// 更新SPU
app.put('/admin/product/updateSpuInfo', handleUpdateSpuInfo);
app.put('/api/admin/product/updateSpuInfo', handleUpdateSpuInfo);

function handleUpdateSpuInfo(req, res) {
  res.json(successResponse(null, '更新SPU成功'));
}

// 删除SPU
app.delete('/admin/product/deleteSpu/:spuId', handleDeleteSpu);
app.delete('/api/admin/product/deleteSpu/:spuId', handleDeleteSpu);

function handleDeleteSpu(req, res) {
  res.json(successResponse(null, '删除SPU成功'));
}

// ==================== 商品 SKU 接口 ====================

// 获取某个SPU下的全部的售卖商品的图片数据
app.get('/admin/product/spuImageList/:spuId', handleSpuImageList);
app.get('/api/admin/product/spuImageList/:spuId', handleSpuImageList);

function handleSpuImageList(req, res) {
  res.json(successResponse([
    { id: 1, imgName: '正面图', imgUrl: 'https://img1.baidu.com/it/u=364488547,2216923041&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' },
    { id: 2, imgName: '背面图', imgUrl: 'https://img2.baidu.com/it/u=2983920986,3520767603&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' }
  ]));
}

// 获取某个SPU下的全部的已有的销售属性接口
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

// 新增SKU
app.post('/admin/product/saveSkuInfo', handleSaveSkuInfo);
app.post('/api/admin/product/saveSkuInfo', handleSaveSkuInfo);

function handleSaveSkuInfo(req, res) {
  res.json(successResponse({ id: Date.now() }, '新增SKU成功'));
}

// 根据SPU ID查询SKU
app.get('/admin/product/findBySpuId/:spuId', handleFindBySpuId);
app.get('/api/admin/product/findBySpuId/:spuId', handleFindBySpuId);

function handleFindBySpuId(req, res) {
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

// 获取商品 SKU 分页列表
app.get('/admin/product/list/:page/:limit', handleSkuList);
app.get('/api/admin/product/list/:page/:limit', handleSkuList);

function handleSkuList(req, res) {
  const page = parseInt(req.params.page);
  const limit = parseInt(req.params.limit);

  const skus = [
    {
      id: 1001,
      skuName: '华为Mate60 黑色 128G',
      price: 5999,
      weight: '200',
      skuDefaultImg: 'https://img1.baidu.com/it/u=364488547,2216923041&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      isSale: 1
    },
    {
      id: 1002,
      skuName: 'iPhone 15 白色 256G',
      price: 7999,
      weight: '180',
      skuDefaultImg: 'https://img2.baidu.com/it/u=2983920986,3520767603&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      isSale: 1
    }
  ];

  const start = (page - 1) * limit;
  const end = start + limit;
  const pageSkus = skus.slice(start, end);

  res.json(successResponse({
    records: pageSkus,
    total: skus.length,
    size: limit,
    current: page,
    pages: Math.ceil(skus.length / limit)
  }));
}

// 商品上架接口
app.get('/admin/product/onSale/:skuId', handleOnSale);
app.get('/api/admin/product/onSale/:skuId', handleOnSale);

function handleOnSale(req, res) {
  res.json(successResponse(null, '商品上架成功'));
}

// 商品下架接口
app.get('/admin/product/cancelSale/:skuId', handleCancelSale);
app.get('/api/admin/product/cancelSale/:skuId', handleCancelSale);

function handleCancelSale(req, res) {
  res.json(successResponse(null, '商品下架成功'));
}

// 商品详情接口
app.get('/admin/product/getSkuInfo/:skuId', handleGetSkuInfo);
app.get('/api/admin/product/getSkuInfo/:skuId', handleGetSkuInfo);

function handleGetSkuInfo(req, res) {
  res.json(successResponse({
    id: 1001,
    skuName: '华为Mate60 黑色 128G',
    price: 5999,
    weight: '200',
    skuDefaultImg: 'https://img1.baidu.com/it/u=364488547,2216923041&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    skuImageList: [
      { id: 1, imgName: '正面图', imgUrl: 'https://img1.baidu.com/it/u=364488547,2216923041&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' },
      { id: 2, imgName: '背面图', imgUrl: 'https://img2.baidu.com/it/u=2983920986,3520767603&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' }
    ],
    skuAttrValueList: [
      { attrId: 1, valueName: '黑色' },
      { attrId: 2, valueName: '128G' }
    ],
    category3Id: 111,
    tmId: 1,
    spuId: 1,
    saleAttrValueList: [
      { id: 1, saleAttrValueName: '黑色' },
      { id: 21, saleAttrValueName: '128G' }
    ]
  }));
}

// 删除商品接口
app.delete('/admin/product/deleteSKU/:skuId', handleDeleteSKU);
app.delete('/api/admin/product/deleteSKU/:skuId', handleDeleteSKU);

function handleDeleteSKU(req, res) {
  res.json(successResponse(null, '删除商品成功'));
}

// ==================== 根路径和Swagger ====================

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: 'Vuepick Complete Backend Server Running',
    endpoints: [
      '用户登录与信息: /admin/acl/index/*',
      '菜单管理: /admin/acl/permission/*',
      '角色管理: /admin/acl/role/*',
      '用户管理: /admin/acl/user/*',
      '商品基础属性: /admin/product/attrInfoList/*',
      '品牌管理: /admin/product/baseTrademark/*',
      '文件上传: /admin/product/fileUpload',
      '商品分类: /admin/product/getCategory*',
      '商品SPU: /admin/product/*',
      '商品SKU: /admin/product/list/*'
    ]
  });
});

// Swagger 文档页面
app.get('/swagger/index.html', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const swaggerPath = path.join(__dirname, 'swagger-complete.html');
  res.sendFile(swaggerPath);
});

app.get('/swagger', (req, res) => {
  res.redirect('/swagger/index.html');
});

// 启动服务器
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 完整后端服务运行在 http://127.0.0.1:${PORT}`);
  console.log(`📖 Swagger文档: http://127.0.0.1:${PORT}/swagger/index.html`);
  console.log(`✅ 包含完整的权限管理和商品管理API`);
});

module.exports = app;
