import { db } from './until';

const UpdateUserInfo = async (data: {
  name: string;
  phone: string;
  role: string;
  _id: string;
}) => {
  return await db.collection('User').doc(data._id).update({
    name: data.name,
    phone: data.phone,
    role: data.role,
  });
};
export { UpdateUserInfo };
