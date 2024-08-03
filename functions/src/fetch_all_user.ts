import { db } from './until';

const _ = db.command;
const fetchAllUser = async () => {
  const res = await db.collection('User').where({
    isLeave: _.neq(true)
  }).get();
  return res;
};
export { fetchAllUser };
