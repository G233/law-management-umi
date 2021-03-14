// @ts-ignore
/* eslint-disable */

declare namespace API {
  // 储存到本地的用户信息
  interface UserInfo {
    name?: string;
    phone?: string;
    uid: string;
    email: string;
    avatarUrl?: string;
  }
  interface LoginParams {
    email?: string;
    password?: string;
    autoLogin?: boolean;
  }
}
