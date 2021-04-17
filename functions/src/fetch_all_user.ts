import { db } from './until';

const fetchAllUser = async () => {
  const res = await db.collection('User').aggregate().limit(1000).end();
  return res;
};
export { fetchAllUser };
