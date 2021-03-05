import { auth, db } from '@/cloud_function';

export interface UserInfo {
  name?: string;
  phone?: string;
  uid: string;
  email: string;
  avatarUrl?: string;
}

export const fetchUserInfo = async () => {
  if (auth.hasLoginState()) {
    const currentUser = await auth.getCurrenUser();
    const collection = db.collection('User');
    const User = await collection
      .where({
        _openid: currentUser?.uid,
      })
      .get();
    const userInfo: UserInfo = formatUserInfo(currentUser, User.data[0]);
    return userInfo;
  }
  return null;
};

const formatUserInfo = (currentUser: any, data: any) => {
  return {
    name: data.name ?? null,
    phone: data.phone ?? null,
    uid: currentUser.uid,
    email: currentUser.email,
    avatarUrl: data.avatarUrl ?? null,
  };
};

export const signOut = async () => {
  return auth.signOut();
};

export const signIn = async (email: string, password: string) => {
  return await auth.signInWithEmailAndPassword(email, password);
};
