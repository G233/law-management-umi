// src/access.ts
import { UserInfo } from '@/services/user';

export default function (initialState: {
  hasLogin: boolean;
  currentUser: UserInfo;
}) {
  const role = initialState?.currentUser?.role;
  return {
    admin: role === 'admin',
  };
}
