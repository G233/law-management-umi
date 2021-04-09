import { message } from 'antd';
import { auth, db, cloudApp } from '@/cloud_function';

const collection = db.collection('User');

import {
  cloudFunction,
  cloudFIndById,
  cloudUpdateById,
  cloudWhere,
} from '@/services/until';
export interface emailProp {
  newEmail: string;
  oldEmail: string;
}

export interface userInfoProp {
  name: string;
  phone: string;
}

export interface UserInfo {
  name?: string;
  phone?: string;
  uid: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

// 退出登陆
export const signOut = async () => {
  return auth.signOut();
};

// 登陆
export const signIn = async (email: string, password: string) => {
  return await auth.signInWithEmailAndPassword(email, password);
};

// 获取用户信息
export const fetchUserInfo = async () => {
  if (auth.hasLoginState()) {
    const currentUser = await auth.getCurrenUser();
    const User = await cloudWhere('User', { _openid: currentUser?.uid });
    // 如果是第一次登陆系统需要在自定义的用户表中新建

    if (!User[0]) {
      addUserInfo(currentUser?.uid as string);
    }

    const userInfo = formatUserInfo(currentUser, User[0]);

    return userInfo;
  }
  return null;
};

// 新建用户信息
const addUserInfo = async (openId: string) => {
  const userInfo = {
    name: '律师',
    phone: '',
    role: 'user',
  };
  const res = await collection.add(userInfo);
  console.log('🚀 ~ file: user.ts ~ line 66 ~ addUserInfo ~ res', res);
};

// 格式化用户信息
const formatUserInfo = (currentUser: any, data: any): UserInfo => {
  return {
    name: data?.name,
    phone: data?.phone,
    uid: currentUser?.uid,
    email: currentUser?.email,
    avatarUrl: data?.avatarUrl,
    role: data.role ?? 'user',
  };
};

// 重设个人信息
export const reSetUserInfo = async (data: userInfoProp, uid: string) => {
  const User = await cloudWhere('User', { _openid: uid });
  const docId: string = User[0]._id;
  await collection.doc(docId).update(data);

  message.success('更新个人信息成功！');
};

// 重置邮箱
export const resetEmail = async (newEmail: string, oldEmail: string) => {
  if (newEmail === oldEmail) {
    message.warning('请输入新邮箱进行修改');
    return;
  }
  return auth.currentUser
    ?.updateEmail(newEmail)
    .then(() => {
      message.success('确认邮件已发送到新邮箱，请注意查收');
    })
    .catch((err) => {
      message.error('更改邮箱失败，请稍后再试');
    });
};

// 更改密码
export const resetPassword = async (email: string) => {
  return auth.sendPasswordResetEmail(email).then(() => {
    message.success('重置密码邮件发送成功，请注意查收');
  });
};

// 获取所有用户信息
export const fetchAllUser = async () => {
  const res = await cloudFunction('fetch_all_user');
  return res;
};

// 添加用户
export const addUser = async (data: { email: string }) => {
  console.log(data);
  cloudApp
    .auth({
      persistence: 'local',
    })
    .signUpWithEmailAndPassword('214546439@qq.com', 'heqing123456')
    .then(() => {
      // 发送验证邮件成功
    });
  // auth.sendPasswordResetEmail('liuxgu@qq.com').then(() => {
  //   // 发送重置密码邮件成功
  // });
  const res = await cloudFunction('fetch_all_user');
  return res;
};
