import { message } from 'antd';
import { auth, db } from '@/cloud_function';

const collection = db.collection('User');

import { cloudFunction, cloudWhere } from '@/services/until';

// 云开发中的用户字段
export interface UserCloudInfo {
  avatarUrl: string;
  customUserId: string;
  gender: string;
  location: { country: string; province: string; city: string };
  loginType: string;
  nickName: string;
  openid: string;
  qqMiniOpenId: string;
  uid: string;
  unionId: string;
  wxOpenId: string;
  wxPublicId: string;
  isLeave?: boolean;
}
// 自定义的用户字段
export interface UserAddInfo {
  name?: string;
  phone?: string;
  uid: string;
  role: string;
  // 执业证号
  licenseNumber?: string;
  // 执业起始时间
  startDate?: Date;
  // 性别
  sex?: string;
  hasAddInfo: boolean;
}

export const sexText = {
  MALE: '男',
  FEMALE: '女',
};
export interface UserInfo extends UserAddInfo, UserCloudInfo {}

// 退出登陆
export const signOut = async () => {
  return auth.signOut();
};

// 获取用户信息
export const fetchUserInfo = async () => {
  if (auth.hasLoginState()) {
    const currentUser = await auth.getCurrenUser();
    let User = await cloudWhere('User', { unionId: currentUser?.unionId });
    // 如果是第一次登陆系统需要在自定义的用户表中新建
    if (!User?.[0]) {
      await addUserInfo(currentUser?.unionId as string);
      User = await cloudWhere('User', { unionId: currentUser?.unionId });
    }
    const userInfo = formatUserInfo(currentUser, User[0]);
    return userInfo;
  }
  return null;
};

// 新建用户信息
const addUserInfo = async (unionId: string) => {
  const userInfo = {
    name: null,
    phone: null,
    role: 'user',
    unionId,
    hasAddInfo: false,
  };
  await collection.add(userInfo);
};

// 格式化用户信息
const formatUserInfo = (currentUser: any, data: any): UserInfo => {
  return {
    name: data?.name,
    role: data?.role ?? 'user',
    licenseNumber: data?.licenseNumber,
    startDate: data?.startDate,
    sex: data?.sex,
    hasAddInfo: data?.hasAddInfo,
    isLeave: data?.isLeave,
    ...currentUser,
    // 在生产环境下，currentUser 里面会有空白 phone
    phone: data?.phone,
  };
};

// 重设个人信息
export const reSetUserInfo = async (
  data: UserAddInfo,
  unionId: string,
  refresh: () => Promise<any>,
) => {
  const User = await cloudWhere('User', { unionId: unionId });
  const docId: string = User[0]._id;

  // 标记用户已填写完整信息
  const updateData = {
    ...data,
    hasAddInfo: true,
  };
  
  const res = await collection.doc(docId).update(updateData);
  // 重新获取用户信息
  if (res.updated == 1) {
    message.success('您的个人信息已经更新好了！');
    await refresh();
    return;
  }
};

// 获取所有普通用户信息
export const fetchAllUser = async () => {
  const res = await cloudFunction('fetch_all_user');
  return res;
};

interface rowType {
  index: number;
  name: string;
  phone: string;
  role: string;
  _id: string;
  unionId: string;
}

// 管理律师修改人员信息
export const updateUserInfo = async (_: any, row: rowType) => {
  const res = await cloudFunction('update_user_info', row);
  if (res?.updated) {
    message.success('更新信息成功！');
    return true;
  }
};

export const deleteUser = async (_: any, row: rowType) => {
  const date = {
    ...row,
    isLeave: true,
  }

  const res = await cloudFunction('update_user_info', date);
  if (res?.updated) {
    message.success('删除成功');
    return true;
  }
}
