import { db } from './until';
import { requireAdmin } from './auth';

const UpdateUserInfo = async (
  data: {
    name: string;
    phone: string;
    role: string;
    _id: string;
    licenseNumber?: string;
    // 执业起始时间
    startDate?: Date;
    // 性别
    sex?: string;
    // 是否离职
    isLeave?: boolean;
  },
  context: any,
) => {
  // 只有管理员可以更新用户信息
  await requireAdmin(context);
  
  return await db.collection('User').doc(data._id).update({
    name: data.name,
    phone: data.phone,
    role: data.role,
    licenseNumber: data.licenseNumber,
    startDate: data.startDate,
    sex: data.sex,
    isLeave: data.isLeave,
  });
};
export { UpdateUserInfo };
