import { db, noticeType, CaseStatus, noticeState, _ } from './until';

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
  const notices = res.data
    .filter((user: any) => user.unionId !== Case.undertaker)
    .map((user: any) => ({
      title: '审批通知',
      unionId: user.unionId,
      msg: '有案件报批信息更改了，请点击查看。',
      caseId: id,
      state: noticeState.unReade,
      createTime: new Date(),
      type: noticeType.approve,
    }));
  await Promise.all(notices.map((notice) => db.collection('Notice').add(notice)));
};

const changeCase = async (props: { case: any; id: any }) => {
  const Case = props.case;
  const id = props.id;
  // 不要覆盖原始的 createTime，只重置审批相关字段
  const updateData = {
    ...Case,
    approveStatus: CaseStatus.WAITING,
    approveMsg: null,
    approveTime: null,
    approverId: null,
  };
  // 从 updateData 中删除 createTime 以避免覆盖
  delete updateData.createTime;
  
  const res = await db.collection('Cases').doc(id).update(updateData);
  await updateCaseCause(Case).catch((e) => {});
  // 重新通知管理律师进行审批
  await addNotice(Case, id).catch((e) => {});

  return res;
};

export { changeCase };
