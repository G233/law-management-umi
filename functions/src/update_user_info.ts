import { db } from './until';

const UpdateUserInfo = async (data: {
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
}) => {
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
