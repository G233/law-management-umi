import { message } from 'antd';
import { auth, db, cloudApp } from '@/cloud_function';

const collection = db.collection('User');

import { cloudFunction, cloudWhere } from '@/services/until';

export interface emailProp {
  newEmail: string;
  oldEmail: string;
}

// 云开发中的用户字段
export interface UserCloudInfo {
  avatarUrl: string;
  customUserId: string;
  gender: string;
  hasPassword: false;
  location: { country: string; province: string; city: string };
  loginType: string;
  nickName: string;
  openid: string;
  qqMiniOpenId: string;
  uid: string;
  unionId: string;
  wxOpenId: string;
  wxPublicId: string;
}
// 自定义的用户字段
export interface UserAddInfo {
  name?: string;
  phone?: string;
  uid: string;
  // 没有使用邮箱了，将废弃
  email?: string;
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

// 登陆
export const signIn = async (email: string, password: string) => {
  return await auth.signInWithEmailAndPassword(email, password);
};

// 获取用户信息
export const fetchUserInfo = async () => {
  if (auth.hasLoginState()) {
    const currentUser = await auth.getCurrenUser();
    console.log(
      '🚀 ~ file: user.ts ~ line 66 ~ fetchUserInfo ~ currentUser',
      currentUser,
    );
    let User = await cloudWhere('User', { unionId: currentUser?.unionId });
    // 如果是第一次登陆系统需要在自定义的用户表中新建
    if (!User?.[0]) {
      await addUserInfo(currentUser?.unionId as string);
      User = await cloudWhere('User', { unionId: currentUser?.unionId });
    }
    console.log('附加用户数据');
    console.log(User[0]);
    console.log('基础用户数据');
    console.log(currentUser);
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
    phone: data?.phone,
    role: data?.role ?? 'user',
    licenseNumber: data?.licenseNumber,
    startDate: data?.startDate,
    sex: data?.sex,
    hasAddInfo: data?.hasAddInfo,
    ...currentUser,
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
  data.hasAddInfo = true;
  const res = await collection.doc(docId).update(data);
  // 重新获取用户信息
  if (res.updated == 1) {
    message.success('您的个人信息已经更新好了！');
    await refresh();
    return;
  }
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
    message.success('重置密码邮件已发送，请注意查收');
  });
};

// 获取所有普通用户信息
export const fetchAllUser = async () => {
  const res = await cloudFunction('fetch_all_user');
  return res;
};

// 添加用户
export const addUser = (data: { email: string }) =>
  cloudApp
    .auth({
      persistence: 'local',
    })
    .signUpWithEmailAndPassword(data.email, 'heqing123456')
    .then((res) => {
      message.success('注册成功,请前往邮箱确认');
    })
    .catch((err) => {
      message.error('邮箱注册失败,请检查此邮箱是否已经注册');
    });

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

export const updateUserName = async (userName: string) => {
  if (!(await auth.isUsernameRegistered(userName)) && auth.currentUser) {
    const res = await auth.currentUser.updateUsername(userName).catch((e) => {
      message.error('设置用户名失败，请联系刘固');
    });
    //@ts-ignore
    if (res) {
      message.success('设置用户名成功');
    }
    return;
  }
  message.warning('此用户名已经被使用，请换一个吧');
};

export const updatePassword = async (
  oldPssword: string,
  newPassword: string,
) => {
  if (auth.currentUser) {
    const res = await auth.currentUser
      .updatePassword(newPassword, oldPssword)
      .catch((e) => {
        message.warning('密码设置失败，请检查密码是否过于简单');
      });
    //@ts-ignore
    if (res) {
      message.success('设置密码成功');
    }
  }
};
