import { db } from './until';
import { getCallerInfo, filterSensitiveUserInfo } from './auth';

const _ = db.command;
const fetchAllUser = async (_data: any, context: any) => {
  // 验证调用者身份
  const caller = await getCallerInfo(context);
  
  const res = await db
    .collection('User')
    .where({
      isLeave: _.neq(true),
    })
    .get();
  
  // 过滤敏感信息：非管理员不能看到手机号
  if (!caller.isAdmin) {
    res.data = res.data.map((user: any) =>
      filterSensitiveUserInfo(user, false),
    );
  }
  
  return res;
};
export { fetchAllUser };
