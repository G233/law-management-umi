const cloudbase = require('@cloudbase/node-sdk');
const { v4: uuidv4 } = require('uuid');

const CaseStatus = {
  AGREE: 0,
  WAITING: 1,
  REJECT: 2,
};

const app = cloudbase.init({
  env: 'atom-2gbnzw0gde4242dc',
});
const CaseCauseId = '28ee4e3e605adc2e0c514fe90a97ea26';

const db = app.database();
const _ = db.command;

const noticeType = {
  approve: 'approve', // 有人发起审批
  approveResult: 'approveResult', // 审批结果
  msg: 'msg',
};

const noticeState = {
  unReade: 0,
  read: 1,
};

// 当前案由没有在缓存中就添加
const updateCaseCause = async ({ caseCause }) => {
  console.log('caseCause', caseCause);
  const caseCauseCache = db.collection('Cache').doc(CaseCauseId);
  const Cache = await caseCauseCache.get();
  if (Cache.data[0].caseCauseList.indexOf(caseCause) !== -1) return;
  await caseCauseCache
    .update({
      caseCauseList: _.push(caseCause),
    })
    .catch((e) => e);
};

// 新建针对所有管理律师的审批通知
const addNotice = async (Case, id) => {
  const res = await db
    .collection('User')
    .where({
      role: 'admin',
    })
    .get();
  res.data.forEach((user) => {
    // 自己新建的不需要通知
    if (user._openid !== Case.undertaker) {
      console.log('审批了');
      const notice = {
        title: '审批通知',
        openId: user._openid,
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

const formatCase = (value, id) => {
  value.createTime = new Date();
  value.approveStatus = CaseStatus.WAITING;
  value._id = id;
  return value;
};

exports.main = async (Case) => {
  const id = uuidv4();
  console.log('id:', id);
  const res = await db.collection('Cases').add(formatCase(Case, id));
  // 如果成功新建了审批的话,就添加通知
  await updateCaseCause(Case).catch((e) => {});
  await addNotice(Case, id).catch((e) => {});

  return res;
};
