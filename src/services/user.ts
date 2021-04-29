import { message } from 'antd';
import { auth, db, cloudApp } from '@/cloud_function';

const collection = db.collection('User');

import { cloudFunction, cloudWhere } from '@/services/until';

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
    console.log('登陆用户信息');
    console.log(currentUser);
    const User = await cloudWhere('User', { _openid: currentUser?.uid });
    // 如果是第一次登陆系统需要在自定义的用户表中新建

    if (!User?.[0]) {
      await addUserInfo(currentUser?.uid as string);
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
    role: data?.role ?? 'user',
    ...currentUser,
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
  _openid: string;
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
