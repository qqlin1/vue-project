// 登录接口参数类型
export interface LoginParams {
  username: string;
  password: string;
}

// 登录响应数据类型
export interface LoginResponse {
  code: number;
  message: string;
  data: string; // 后端直接返回token字符串，而不是对象
  ok?: boolean;
}

// 用户信息响应数据类型
export interface UserInfoResponse {
  code: number;
  message: string;
  data: {
    userId: number;
    username: string;
    avatar?: string;
    roles?: string[];
    permissions?: string[];
    // 其他用户信息字段
  };
}

// 通用响应数据类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}