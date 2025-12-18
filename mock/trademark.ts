// 创建品牌数据函数
function createTrademarkList() {
  return [
    {
      id: 1,
      tmName: '小米',
      logoUrl: 'https://example.com/xiaomi.png'
    },
    {
      id: 2,
      tmName: '华为',
      logoUrl: 'https://example.com/huawei.png'
    },
    {
      id: 3,
      tmName: '苹果',
      logoUrl: 'https://example.com/apple.png'
    },
    {
      id: 4,
      tmName: '三星',
      logoUrl: 'https://example.com/samsung.png'
    },
    {
      id: 5,
      tmName: 'OPPO',
      logoUrl: 'https://example.com/oppo.png'
    },
    {
      id: 6,
      tmName: 'vivo',
      logoUrl: 'https://example.com/vivo.png'
    },
    {
      id: 7,
      tmName: '联想',
      logoUrl: 'https://example.com/lenovo.png'
    },
    {
      id: 8,
      tmName: '戴尔',
      logoUrl: 'https://example.com/dell.png'
    },
    {
      id: 9,
      tmName: '华硕',
      logoUrl: 'https://example.com/asus.png'
    },
    {
      id: 10,
      tmName: '惠普',
      logoUrl: 'https://example.com/hp.png'
    },
    {
      id: 11,
      tmName: '宏碁',
      logoUrl: 'https://example.com/acer.png'
    },
    {
      id: 12,
      tmName: '索尼',
      logoUrl: 'https://example.com/sony.png'
    },
    {
      id: 13,
      tmName: '微软',
      logoUrl: 'https://example.com/microsoft.png'
    },
    {
      id: 14,
      tmName: 'LG',
      logoUrl: 'https://example.com/lg.png'
    },
    {
      id: 15,
      tmName: 'TCL',
      logoUrl: 'https://example.com/tcl.png'
    },
    {
      id: 16,
      tmName: '海信',
      logoUrl: 'https://example.com/hisense.png'
    },
    {
      id: 17,
      tmName: '创维',
      logoUrl: 'https://example.com/skyworth.png'
    },
    {
      id: 18,
      tmName: '格力',
      logoUrl: 'https://example.com/gree.png'
    },
    {
      id: 19,
      tmName: '美的',
      logoUrl: 'https://example.com/midea.png'
    },
    {
      id: 20,
      tmName: '海尔',
      logoUrl: 'https://example.com/haier.png'
    },
    {
      id: 21,
      tmName: '努比亚',
      logoUrl: 'https://example.com/nubia.png'
    },
    {
      id: 22,
      tmName: 'realme',
      logoUrl: 'https://example.com/realme.png'
    },
    {
      id: 23,
      tmName: '荣耀',
      logoUrl: 'https://example.com/honor.png'
    },
    {
      id: 24,
      tmName: '魅族',
      logoUrl: 'https://example.com/meizu.png'
    },
    {
      id: 25,
      tmName: '锤子',
      logoUrl: 'https://example.com/smartisan.png'
    }
  ]
}

// 对外暴露接口
export default [
  // 获取品牌列表接口 - 支持分页
  {
    url: '/api/admin/product/baseTrademark/',
    method: 'get',
    response: ({ query }: { query: any }) => {
      const { page = 1, limit = 10 } = query;
      const trademarkList = createTrademarkList();

      // 模拟分页
      const start = (parseInt(page) - 1) * parseInt(limit);
      const end = start + parseInt(limit);
      const list = trademarkList.slice(start, end);

      return {
        code: 200,
        data: {
          records: list,
          total: trademarkList.length,
          size: parseInt(limit),
          current: parseInt(page),
          pages: Math.ceil(trademarkList.length / parseInt(limit))
        }
      };
    }
  },

  // 根据id获取品牌信息
  {
    url: '/api/admin/product/baseTrademark/:id',
    method: 'get',
    response: ({ params }: { params: any }) => {
      const { id } = params;
      const trademark = createTrademarkList().find(item => item.id === parseInt(id));

      if (trademark) {
        return { code: 200, data: trademark };
      } else {
        return { code: 201, data: { message: '品牌不存在' } };
      }
    }
  },

  // 添加品牌
  {
    url: '/api/admin/product/baseTrademark/save',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const { tmName, logoUrl } = body;

      if (tmName && logoUrl) {
        return {
          code: 200,
          data: {
            id: Date.now(), // 模拟生成新id
            tmName,
            logoUrl
          }
        };
      } else {
        return { code: 201, data: { message: '参数不完整' } };
      }
    }
  },

  // 更新品牌
  {
    url: '/api/admin/product/baseTrademark/update',
    method: 'put',
    response: ({ body }: { body: any }) => {
      const { id, tmName, logoUrl } = body;

      if (id && tmName && logoUrl) {
        return { code: 200, data: { message: '更新成功' } };
      } else {
        return { code: 201, data: { message: '参数不完整' } };
      }
    }
  },

  // 删除品牌
  {
    url: '/api/admin/product/baseTrademark/remove/:id',
    method: 'delete',
    response: ({ params }: { params: any }) => {
      const { id } = params;

      if (id) {
        return { code: 200, data: { message: '删除成功' } };
      } else {
        return { code: 201, data: { message: '参数错误' } };
      }
    }
  }
];
