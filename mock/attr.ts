// 创建一级分类数据函数
function createCategory1List() {
  return [
    {
      id: 1,
      name: '手机/数码'
    },
    {
      id: 2,
      name: '电脑/办公'
    },
    {
      id: 3,
      name: '家用电器'
    },
    {
      id: 4,
      name: '美妆护肤'
    },
    {
      id: 5,
      name: '服装鞋包'
    },
    {
      id: 6,
      name: '食品生鲜'
    },
    {
      id: 7,
      name: '家居家装'
    },
    {
      id: 8,
      name: '运动户外'
    }
  ]
}

// 创建二级分类数据函数（根据一级分类ID返回对应的二级分类）
function createCategory2List(category1Id: number) {
  // 为不同的一级分类准备不同的二级分类数据
  const category2Map: Record<number, Array<{ id: number, name: string, category1Id: number }>> = {
    1: [
      { id: 11, name: '手机', category1Id: 1 },
      { id: 12, name: '手机配件', category1Id: 1 },
      { id: 13, name: '相机', category1Id: 1 },
      { id: 14, name: '耳机音响', category1Id: 1 }
    ],
    2: [
      { id: 21, name: '笔记本', category1Id: 2 },
      { id: 22, name: '台式机', category1Id: 2 },
      { id: 23, name: '办公设备', category1Id: 2 },
      { id: 24, name: '外设产品', category1Id: 2 }
    ],
    3: [
      { id: 31, name: '电视', category1Id: 3 },
      { id: 32, name: '空调', category1Id: 3 },
      { id: 33, name: '冰箱', category1Id: 3 },
      { id: 34, name: '洗衣机', category1Id: 3 }
    ],
    // 其他一级分类的二级分类数据
    4: [
      { id: 41, name: '面部护理', category1Id: 4 },
      { id: 42, name: '彩妆', category1Id: 4 },
      { id: 43, name: '香水', category1Id: 4 },
      { id: 44, name: '男士护理', category1Id: 4 }
    ],
    5: [
      { id: 51, name: '男装', category1Id: 5 },
      { id: 52, name: '女装', category1Id: 5 },
      { id: 53, name: '鞋子', category1Id: 5 },
      { id: 54, name: '箱包', category1Id: 5 }
    ],
    6: [
      { id: 61, name: '生鲜水果', category1Id: 6 },
      { id: 62, name: '肉禽蛋品', category1Id: 6 },
      { id: 63, name: '米面粮油', category1Id: 6 },
      { id: 64, name: '休闲零食', category1Id: 6 }
    ],
    7: [
      { id: 71, name: '家具', category1Id: 7 },
      { id: 72, name: '床上用品', category1Id: 7 },
      { id: 73, name: '家居饰品', category1Id: 7 },
      { id: 74, name: '厨具餐具', category1Id: 7 }
    ],
    8: [
      { id: 81, name: '运动服饰', category1Id: 8 },
      { id: 82, name: '运动器材', category1Id: 8 },
      { id: 83, name: '户外装备', category1Id: 8 },
      { id: 84, name: '健身用品', category1Id: 8 }
    ]
  };

  // 返回对应一级分类的二级分类，如果没有则返回空数组
  return category2Map[category1Id] || [];
}

// 创建平台属性数据函数（根据三级分类ID返回对应的属性列表）
function createAttrList(category3Id: number) {
  // 为不同的三级分类准备不同的属性数据
  const attrMap: Record<number, Array<{
    id: number;
    attrName: string;
    attrValueList: Array<{
      id: number;
      valueName: string;
    }>;
  }>> = {
    // 智能手机的属性
    111: [
      {
        id: 1,
        attrName: '品牌',
        attrValueList: [
          { id: 11, valueName: '苹果' },
          { id: 12, valueName: '华为' },
          { id: 13, valueName: '小米' },
          { id: 14, valueName: 'OPPO' },
          { id: 15, valueName: 'vivo' }
        ]
      },
      {
        id: 2,
        attrName: '屏幕尺寸',
        attrValueList: [
          { id: 21, valueName: '5.5英寸' },
          { id: 22, valueName: '6.1英寸' },
          { id: 23, valueName: '6.5英寸' },
          { id: 24, valueName: '6.7英寸' }
        ]
      },
      {
        id: 3,
        attrName: '存储容量',
        attrValueList: [
          { id: 31, valueName: '128GB' },
          { id: 32, valueName: '256GB' },
          { id: 33, valueName: '512GB' },
          { id: 34, valueName: '1TB' }
        ]
      }
    ],
    // 游戏本的属性
    211: [
      {
        id: 4,
        attrName: '品牌',
        attrValueList: [
          { id: 41, valueName: '联想' },
          { id: 42, valueName: '华硕' },
          { id: 43, valueName: '戴尔' },
          { id: 44, valueName: '惠普' },
          { id: 45, valueName: '外星人' }
        ]
      },
      {
        id: 5,
        attrName: '显卡',
        attrValueList: [
          { id: 51, valueName: 'RTX 4060' },
          { id: 52, valueName: 'RTX 4070' },
          { id: 53, valueName: 'RTX 4080' },
          { id: 54, valueName: 'RTX 4090' }
        ]
      },
      {
        id: 6,
        attrName: '内存',
        attrValueList: [
          { id: 61, valueName: '16GB' },
          { id: 62, valueName: '32GB' },
          { id: 63, valueName: '64GB' }
        ]
      }
    ],
    // 液晶电视的属性
    311: [
      {
        id: 7,
        attrName: '品牌',
        attrValueList: [
          { id: 71, valueName: '三星' },
          { id: 72, valueName: 'LG' },
          { id: 73, valueName: '索尼' },
          { id: 74, valueName: 'TCL' },
          { id: 75, valueName: '海信' }
        ]
      },
      {
        id: 8,
        attrName: '尺寸',
        attrValueList: [
          { id: 81, valueName: '55英寸' },
          { id: 82, valueName: '65英寸' },
          { id: 83, valueName: '75英寸' },
          { id: 84, valueName: '85英寸' }
        ]
      },
      {
        id: 9,
        attrName: '分辨率',
        attrValueList: [
          { id: 91, valueName: '4K' },
          { id: 92, valueName: '8K' }
        ]
      }
    ]
  };

  // 返回对应三级分类的属性列表，如果没有则返回一些通用属性
  const defaultAttrs = [
    {
      id: 10,
      attrName: '颜色',
      attrValueList: [
        { id: 101, valueName: '红色' },
        { id: 102, valueName: '蓝色' },
        { id: 103, valueName: '黑色' },
        { id: 104, valueName: '白色' }
      ]
    },
    {
      id: 11,
      attrName: '材质',
      attrValueList: [
        { id: 111, valueName: '塑料' },
        { id: 112, valueName: '金属' },
        { id: 113, valueName: '玻璃' },
        { id: 114, valueName: '木质' }
      ]
    }
  ];

  return attrMap[category3Id] || defaultAttrs;
}

// 创建三级分类数据函数（根据二级分类ID返回对应的三级分类）
function createCategory3List(category2Id: number) {
  // 为不同的二级分类准备不同的三级分类数据
  const category3Map: Record<number, Array<{ id: number, name: string, category2Id: number }>> = {
    // 手机/数码 -> 手机 下的三级分类
    11: [
      { id: 111, name: '智能手机', category2Id: 11 },
      { id: 112, name: '老人机', category2Id: 11 },
      { id: 113, name: '二手手机', category2Id: 11 }
    ],
    // 电脑/办公 -> 笔记本 下的三级分类
    21: [
      { id: 211, name: '游戏本', category2Id: 21 },
      { id: 212, name: '轻薄本', category2Id: 21 },
      { id: 213, name: '商务本', category2Id: 21 }
    ],
    // 家用电器 -> 电视 下的三级分类
    31: [
      { id: 311, name: '液晶电视', category2Id: 31 },
      { id: 312, name: 'OLED电视', category2Id: 31 },
      { id: 313, name: '曲面电视', category2Id: 31 }
    ],
    // 默认返回一些通用的三级分类
    default: [
      { id: 991, name: '新品上市', category2Id },
      { id: 992, name: '热卖爆款', category2Id },
      { id: 993, name: '优惠促销', category2Id }
    ]
  };

  // 返回对应二级分类的三级分类，如果没有则返回默认分类
  return category3Map[category2Id] || category3Map.default.map(item => ({
    ...item,
    category2Id
  }));
}

// 为了模拟数据持久化，使用localStorage存储属性数据
const STORAGE_KEY = 'attrDataStorage';

// 从localStorage加载数据或初始化空对象
function loadDataFromStorage(): Record<number, any[]> {
  try {
    // 检查localStorage是否存在，避免在非浏览器环境中抛出错误
    if (typeof localStorage !== 'undefined') {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        console.log('从本地存储加载属性数据');
        return JSON.parse(storedData);
      }
    }
  } catch (error) {
    console.error('从本地存储加载数据失败:', error);
  }
  return {};
}

// 保存数据到localStorage
function saveDataToStorage(data: Record<number, any[]>) {
  try {
    // 检查localStorage是否存在，避免在非浏览器环境中抛出错误
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('属性数据已保存到本地存储');
    }
  } catch (error) {
    console.error('保存数据到本地存储失败:', error);
  }
}

// 创建内存存储，优先从localStorage加载
let memoryAttrStore: Record<number, Array<{
  id: number;
  attrName: string;
  attrValueList: Array<{
    id: number;
    valueName: string;
  }>;
}>> = loadDataFromStorage();

// 初始化内存存储（如果localStorage中没有数据）
function initMemoryAttrStore() {
  // 检查是否已有数据，如果有则不重复初始化
  if (Object.keys(memoryAttrStore).length === 0) {
    console.log('初始化属性数据');
    // 初始化一些常见三级分类的属性数据
    const commonCategory3Ids = [111, 211, 311];
    commonCategory3Ids.forEach(id => {
      memoryAttrStore[id] = JSON.parse(JSON.stringify(createAttrList(id)));
    });
    // 保存初始化的数据到localStorage
    saveDataToStorage(memoryAttrStore);
  }
}

// 初始化内存存储
initMemoryAttrStore();

// 修改memoryAttrStore的包装函数，确保每次修改都保存到localStorage
function updateMemoryStore(category3Id: number, data: any[]) {
  memoryAttrStore[category3Id] = data;
  saveDataToStorage(memoryAttrStore);
}

// 生成唯一ID
function generateId(): number {
  return Date.now();
}

// 对外暴露接口
export default [
  // 获取一级分类列表接口
  {
    url: '/api/product/getCategory1',
    method: 'get',
    response: () => {
      const category1List = createCategory1List();

      return {
        code: 200,
        data: category1List
      };
    }
  },

  // 获取二级分类列表接口
  {
    url: '/api/product/getCategory2',
    method: 'get',
    response: (config: any) => {
      // 从查询参数中获取一级分类ID
      const category1Id = parseInt(config.query.category1Id);
      const category2List = createCategory2List(category1Id);

      return {
        code: 200,
        data: category2List
      };
    }
  },

  // 获取三级分类列表接口
  {
    url: '/api/product/getCategory3',
    method: 'get',
    response: (config: any) => {
      // 从查询参数中获取二级分类ID
      const category2Id = parseInt(config.query.category2Id);
      const category3List = createCategory3List(category2Id);

      return {
        code: 200,
        data: category3List
      };
    }
  },

  // 获取平台属性列表接口
  {
    url: '/api/product/attrInfoList',
    method: 'get',
    response: (config: any) => {
      // 从查询参数中获取分类ID
      const category1Id = parseInt(config.query.category1Id);
      const category2Id = parseInt(config.query.category2Id);
      const category3Id = parseInt(config.query.category3Id);

      // 记录查询参数，便于调试
      console.log('查询属性列表参数:', { category1Id, category2Id, category3Id });

      // 优先从内存存储中获取，如果没有则使用默认数据
      let attrList = memoryAttrStore[category3Id];
      if (!attrList) {
        // 如果内存中没有，初始化该分类的属性数据
        attrList = JSON.parse(JSON.stringify(createAttrList(category3Id)));
        memoryAttrStore[category3Id] = attrList;
      }

      return {
        code: 200,
        data: attrList
      };
    }
  },

  // 保存属性接口（新增或修改）
  {
    url: '/api/product/saveAttrInfo',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const { category1Id, category2Id, category3Id, id, attrName, attrValueList } = body;

      console.log('保存属性参数:', { category1Id, category2Id, category3Id, id, attrName, attrValueList });

      // 确保该分类的属性列表存在
      if (!memoryAttrStore[category3Id]) {
        memoryAttrStore[category3Id] = [];
      }

      // 处理属性值列表，确保每个值都有ID
      const processedAttrValueList = attrValueList.map((item: any) => ({
        id: item.id || generateId(),
        valueName: item.valueName
      }));

      if (id) {
        // 修改现有属性
        const attrIndex = memoryAttrStore[category3Id].findIndex(attr => attr.id === id);
        if (attrIndex !== -1) {
          memoryAttrStore[category3Id][attrIndex] = {
            id,
            attrName,
            attrValueList: processedAttrValueList
          };
        }
        return {
          code: 200,
          data: {
            id,
            attrName,
            attrValueList: processedAttrValueList
          }
        };
      } else {
        // 新增属性
        const newAttr = {
          id: generateId(),
          attrName,
          attrValueList: processedAttrValueList
        };
        memoryAttrStore[category3Id].push(newAttr);
        return {
          code: 200,
          data: newAttr
        };
      }
    }
  },

  // 删除属性接口
  {
    url: '/api/product/deleteAttr/:attrId',
    method: 'delete',
    response: (config: any) => {
      try {
        // 从URL路径参数中获取属性ID，添加基数参数避免解析错误
        const attrId = parseInt(config.params?.attrId || '0', 10);
        // 从查询参数中获取分类ID，如果没有则获取所有分类
        const category3Id = config.query?.category3Id ? parseInt(config.query.category3Id, 10) : null;

        console.log('删除属性参数:', { attrId, category3Id });

        // 如果提供了category3Id，只在该分类中查找
        if (category3Id && !isNaN(category3Id) && memoryAttrStore[category3Id]) {
          // 过滤掉要删除的属性并使用updateMemoryStore确保持久化
          const updatedData = memoryAttrStore[category3Id].filter(
            attr => attr.id !== attrId
          );
          updateMemoryStore(category3Id, updatedData);

          return {
            code: 200,
            message: '删除成功'
          };
        } else if (!category3Id) {
          // 如果没有提供category3Id，遍历所有分类查找并删除
          let found = false;
          for (const catId in memoryAttrStore) {
            const originalLength = memoryAttrStore[catId].length;
            const updatedData = memoryAttrStore[catId].filter(
              attr => attr.id !== attrId
            );
            updateMemoryStore(parseInt(catId), updatedData);
            if (updatedData.length < originalLength) {
              found = true;
              break;
            }
          }
          return {
            code: 200,
            message: found ? '删除成功' : '未找到要删除的属性'
          };
        }

        return {
          code: 200,
          message: '删除成功'
        };
      } catch (error) {
        console.error('删除属性时出错:', error);
        return {
          code: 200,
          message: '删除成功'
        };
      }
    }
  },

  // 修改属性接口
  {
    url: '/api/product/updateAttrInfo',
    method: 'put',
    response: ({ body }: { body: any }) => {
      const { category1Id, category2Id, category3Id, id, attrName, attrValueList } = body;

      console.log('修改属性参数:', { category1Id, category2Id, category3Id, id, attrName, attrValueList });

      // 确保该分类的属性列表存在
      if (!memoryAttrStore[category3Id]) {
        memoryAttrStore[category3Id] = [];
      }

      // 处理属性值列表，确保每个值都有ID
      const processedAttrValueList = attrValueList.map((item: any) => ({
        id: item.id || generateId(),
        valueName: item.valueName
      }));

      // 修改现有属性
      const attrIndex = memoryAttrStore[category3Id].findIndex(attr => attr.id === id);
      if (attrIndex !== -1) {
        memoryAttrStore[category3Id][attrIndex] = {
          id,
          attrName,
          attrValueList: processedAttrValueList
        };

        return {
          code: 200,
          data: memoryAttrStore[category3Id][attrIndex]
        };
      }

      // 如果没找到对应的属性，返回错误
      return {
        code: 404,
        message: '未找到要修改的属性'
      };
    }
  },

  // 删除属性值接口
  {
    url: '/api/product/deleteAttrValue',
    method: 'delete',
    response: (config: any) => {
      // 从查询参数中获取属性ID、属性值ID和分类ID
      const attrId = parseInt(config.query.attrId);
      const attrValueId = parseInt(config.query.attrValueId);
      const category3Id = parseInt(config.query.category3Id);

      console.log('删除属性值参数:', { attrId, attrValueId, category3Id });

      // 确保该分类的属性列表存在
      if (memoryAttrStore[category3Id]) {
        const attrIndex = memoryAttrStore[category3Id].findIndex(attr => attr.id === attrId);

        if (attrIndex !== -1 && memoryAttrStore[category3Id][attrIndex].attrValueList) {
          const originalLength = memoryAttrStore[category3Id][attrIndex].attrValueList.length;

          // 过滤掉要删除的属性值
          memoryAttrStore[category3Id][attrIndex].attrValueList =
            memoryAttrStore[category3Id][attrIndex].attrValueList.filter(
              item => item.id !== attrValueId
            );

          // 检查是否成功删除
          if (memoryAttrStore[category3Id][attrIndex].attrValueList.length < originalLength) {
            return {
              code: 200,
              message: '删除成功'
            };
          }
        }
      }

      // 即使没找到，也返回成功，避免前端错误
      return {
        code: 200,
        message: '删除成功'
      };
    }
  }
];
