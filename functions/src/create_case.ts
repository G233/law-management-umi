const { v4: uuidv4 } = require('uuid');
import { db, CaseStatus, noticeType, noticeState, _ } from './until';

const CaseCauseId = '28ee4e3e605adc2e0c514fe90a97ea26';

// 当前案由没有在缓存中就添加
const updateCaseCause = async ({ caseCause }: { caseCause: string }) => {
  const caseCauseCache = db.collection('Cache').doc(CaseCauseId);
  const Cache = await caseCauseCache.get();
  if (Cache.data[0].caseCauseList.indexOf(caseCause) !== -1) return;
  await caseCauseCache
    .update({
      caseCauseList: _.push(caseCause),
    })
    .catch(() => {});
};

// 新建针对所有管理律师的审批通知
const addNotice = async (Case: any, id: string) => {
  const res = await db
    .collection('User')
    .where({
      role: 'admin',
    })
    .get();
  res.data.forEach((user: any) => {
    // 自己新建的不需要通知
    if (user.unionId !== Case.undertaker) {
      const notice = {
        title: '审批通知',
        unionId: user.unionId,
        msg: '有案件需要审批,请点击查看',
        caseId: id,
        state: noticeState.unReade,
        createTime: new Date(),
        type: noticeType.approve,
      };
      db.collection('Notice').add(notice);
    }
  });
};

const formatCase = (
  value: { createTime: Date; approveStatus: CaseStatus; _id: string },
  id: string,
) => {
  value.createTime = new Date();
  value.approveStatus = CaseStatus.WAITING;
  value._id = id;
  return value;
};

const CreateCase = async (Case: any) => {
  const id = uuidv4();
  const res = await db.collection('Cases').add(formatCase(Case, id));
  // 如果成功新建了审批的话,就添加通知
  await updateCaseCause(Case).catch((e) => {});
  await addNotice(Case, id).catch((e) => {});

  return res;
};

export { CreateCase };
