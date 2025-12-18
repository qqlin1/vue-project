//createUserList:次函数执行会返回一个数组,数组里面包含两个用户信息
function createUserList() {
  return [
    {
      userId: 1,
      avatar:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'admin',
      password: '111111',
      desc: '平台管理员',
      roles: ['平台管理员'],
      buttons: ['cuser.detail'],
      routes: ['home'],
      token: 'Admin Token',
    },
    {
      userId: 2,
      avatar:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'system',
      password: '111111',
      desc: '系统管理员',
      roles: ['系统管理员'],
      buttons: ['cuser.detail', 'cuser.user'],
      routes: ['home'],
      token: 'System Token',
    },
  ]
}
//对外暴露一个数组:数组里面包含两个接口
//登录假的接口
//获取用户信息的假的接口
export default [
  // 用户登录接口
  {
    url: '/api/user/login',//请求地址
    method: 'post',//请求方式
    response: ({ body }: { body: any }) => {
      //获取请求体携带过来的用户名与密码
      const { username, password } = body;
      //调用获取用户信息函数,用于判断是否有此用户
      const checkUser = createUserList().find(
        (item) => item.username === username && item.password === password,
      )
      //没有用户返回失败信息
      if (!checkUser) {
        return { code: 201, data: { message: '账号或者密码不正确' } }
      }
      //如果有返回成功信息
      const { token } = checkUser
      return { code: 200, data: { token } }
    },
  },
  // 获取用户信息
  {
    url: '/api/user/info',
    method: 'get',
    response: (request: any) => {
      //获取请求头携带token
      const token = request.headers.token;
      //查看用户信息是否包含有次token用户
      const checkUser = createUserList().find((item) => item.token === token)
      //没有返回失败的信息
      if (!checkUser) {
        return { code: 201, data: { message: '获取用户信息失败' } }
      }
      //如果有返回成功信息
      return { code: 200, data: { checkUser } }
    },
  },
  // 退出登录接口
  {
    url: '/api/user/logout',//请求地址
    method: 'post',//请求方式
    response: () => {
      // 退出登录接口简单返回成功信息
      return { code: 200, data: { message: '退出登录成功' } }
    },
  },
  // 后台管理 - 获取用户分页列表（兼容 params 或 query）
  {
    url: '/api/admin/acl/user/:page/:limit',
    method: 'get',
    response: (request: any) => {
      // 支持 params 或 query 参数形式（有时 vite-plugin-mock 会放在 query）
      const params = request?.params ?? request?.query ?? {};
      const page = Number(params.page ?? 1);
      const limit = Number(params.limit ?? 5);

      // 构建一些示例用户数据
      function createAclUserList() {
        const list = [];
        for (let i = 0; i < 12; i++) {
          const id = 100 - i;
          list.push({
            id,
            createTime: '2023-04-28 13:15:02',
            updateTime: '2023-04-28 13:15:02',
            username: `user${id}`,
            password: 'e10adc3949ba59abbe56e057f20f883e',
            name: `用户名${id}`,
            phone: null,
            roleName: '',
          });
        }
        return list;
      }

      const all = createAclUserList();
      const start = (page - 1) * limit;
      const end = start + limit;
      const records = all.slice(start, end);
      return {
        code: 200,
        message: '成功',
        data: {
          records,
          total: all.length,
          size: limit,
          current: page,
          orders: [],
          optimizeCountSql: true,
          hitCount: false,
          countId: null,
          maxLimit: null,
          searchCount: true,
          pages: Math.ceil(all.length / limit)
        },
        ok: true,
      };
    }
  },
  // 新增 ACL 用户（简单返回成功，不持久化）
  {
    url: '/api/admin/acl/user/save',
    method: 'post',
    response: (request: any) => {
      const body = request?.body ?? {};
      const newUser = {
        id: Date.now(),
        createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        username: body.username || `user${Date.now()}`,
        password: body.password || '123456',
        name: body.name || '',
        phone: body.phone ?? null,
        roleName: body.roleName || ''
      };
      // 简化：不修改实际 aclUsers，直接返回成功
      return { code: 200, data: newUser, message: '新增管理用户成功' };
    }
  },
  // 更新 ACL 用户（简单返回成功，不持久化）
  {
    url: '/api/admin/acl/user/update',
    method: 'put',
    response: (request: any) => {
      const body = request?.body ?? {};
      // 简化: 直接回显传入的body
      const updated = Object.assign({}, body, { updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19) });
      return { code: 200, data: updated, message: '更新成功' };
    }
  }
]
