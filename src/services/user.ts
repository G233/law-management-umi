import { auth } from '@/cloud_function';
import { message } from 'antd';

export const fetchUserInfo = async () => {
  if (auth.hasLoginState()) {
    const currentUser = await auth.getCurrenUser();
    return currentUser;
  }
  return null;
};

export const signOut = async () => {
  return auth.signOut();
};

export const signIn = async (email: string, password: string) => {
  return await auth.signInWithEmailAndPassword(email, password);
};
