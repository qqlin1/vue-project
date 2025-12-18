//统一管理项目用户相关的接口
import request from "@/utils/request";
import type { LoginParams, LoginResponse, UserInfoResponse } from './type';

enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout'
}

// 登录接口方法
export const reqLogin = (data: LoginParams) => request.post<LoginResponse>(API.LOGIN_URL, data);

// 获取用户信息接口方法
export const reqUserInfo = () => request.get<UserInfoResponse>(API.USERINFO_URL);

// 退出登录接口方法
export const reqLogout = () => request.post(API.LOGOUT_URL);