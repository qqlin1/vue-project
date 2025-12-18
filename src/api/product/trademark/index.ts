import request from "@/utils/request";
enum API {


  // 获取品牌列表(分页)
  GET_TRADEMARK_LIST = '/admin/product/baseTrademark',
  // 根据id获取品牌信息
  GET_TRADEMARK_BY_ID = '/admin/product/baseTrademark/remove',
  // 添加品牌
  ADD_TRADEMARK = '/admin/product/baseTrademark/save',
  // 更新品牌
  UPDATE_TRADEMARK = '/admin/product/baseTrademark/update',
  // 删除品牌
  DELETE_TRADEMARK = '/admin/product/baseTrademark/remove/'
}

// 获取品牌列表(分页)
export const reqGetTrademarkList = (page: number, limit: number) => {
  return request({ url:`${API.GET_TRADEMARK_LIST}/${page}/${limit}`, method: 'get'});
};

// 根据id获取品牌信息
export const reqGetTrademarkById = (id: number) => {
  return request({ url:`${API.GET_TRADEMARK_BY_ID}${id}`, method: 'get' });
};

// 添加品牌
export const reqAddTrademark = (data: { tmName: string; logoUrl: string }) => {
  return request({ url: API.ADD_TRADEMARK, method: 'post', data });
};

// 更新品牌
export const reqUpdateTrademark = (data: { id: number; tmName: string; logoUrl: string }) => {
  return request({ url: API.UPDATE_TRADEMARK, method: 'put', data });
};

// 删除品牌
export const reqDeleteTrademark = (id: number) => {
  return request({ url: `${API.DELETE_TRADEMARK}${id}`, method: 'delete' });
};



