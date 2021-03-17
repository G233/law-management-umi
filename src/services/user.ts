import { message } from 'antd';
import { auth, db } from '@/cloud_function';

const collection = db.collection('User');

export interface emailProp {
  newEmail: string;
  oldEmail: string;
}

export interface userInfoProp {
  name: string;
  phone: string;
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
    const User = await collection
      .where({
        _openid: currentUser?.uid,
      })
      .get();
    const userInfo = formatUserInfo(currentUser, User.data[0]);
    return userInfo;
  }
  return null;
};

// 格式化用户信息
const formatUserInfo = (currentUser: any, data: any): API.UserInfo => {
  return {
    name: data.name ?? null,
    phone: data.phone ?? null,
    uid: currentUser.uid,
    email: currentUser.email,
    avatarUrl: data.avatarUrl ?? null,
  };
};

// 重设个人信息
export const reSetUserInfo = async (data: userInfoProp, uid: string) => {
  console.log('111');

  const User = await collection
    .where({
      _openid: uid,
    })
    .get();

  // 如果用户已经设置过个人信息了，则更新信息
  if (User.data[0]) {
    const docId: string = User.data[0]._id;
    await collection.doc(docId).update(data);
  } else {
    await collection.add(data);
  }

  // collection.doc(User.)
  // const res = await collection.add(data);
  message.success('更新个人信息成功！');
};

// 重置邮箱
export const resetEmail = async (newEmail: string, oldEmail: string) => {
  console.log(newEmail, oldEmail);
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
