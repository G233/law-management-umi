import { db } from './until';
import * as cloudbase from '@cloudbase/node-sdk';

const isDev = process.env.NODE_ENV === 'development';
const app = cloudbase.init({
  env: isDev ? 'atom-2gbnzw0gde4242dc' : 'atom-build-3gucmakw82f1fc3c',
});

/**
 * 获取调用者信息
 * 从云函数上下文中获取用户身份
 */
export const getCallerInfo = async (context: any) => {
  // 云函数运行时会提供 LOGINTYPE 和对应的用户标识
  const { LOGINTYPE, OPENID, UNIONID } = context;
  
  if (!LOGINTYPE || LOGINTYPE === 'ANONYMOUS') {
    throw new Error('未授权：请先登录');
  }
  
  const unionId = UNIONID || OPENID;
  if (!unionId) {
    throw new Error('未授权：无法获取用户标识');
  }
  
  // 从数据库获取用户详细信息
  const userRes = await db
    .collection('User')
    .where({ unionId })
    .get();
  
  if (!userRes.data || userRes.data.length === 0) {
    throw new Error('未授权：用户不存在');
  }
  
  const user = userRes.data[0];
  
  // 检查用户是否已离职
  if (user.isLeave) {
    throw new Error('未授权：用户已离职');
  }
  
  return {
    unionId,
    role: user.role || 'user',
    isAdmin: user.role === 'admin',
    user,
  };
};

/**
 * 检查是否为管理员
 */
export const requireAdmin = async (context: any) => {
  const caller = await getCallerInfo(context);
  if (!caller.isAdmin) {
    throw new Error('权限不足：需要管理员权限');
  }
  return caller;
};

/**
 * 过滤敏感信息
 * 非管理员不应看到其他用户的手机号等敏感信息
 */
export const filterSensitiveUserInfo = (user: any, isAdmin: boolean) => {
  if (isAdmin) {
    return user;
  }
  
  // 非管理员只保留基本信息
  const { phone, ...safeInfo } = user;
  return safeInfo;
};
