import { auth, db } from '@/cloud_function';

// 获取用户信息
export const fetchUserInfo = async () => {
  if (auth.hasLoginState()) {
    const currentUser = await auth.getCurrenUser();
    const collection = db.collection('User');
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

// 退出登陆
export const signOut = async () => {
  return auth.signOut();
};

// 登陆
export const signIn = async (email: string, password: string) => {
  return await auth.signInWithEmailAndPassword(email, password);
};
