// 一键审批函数
const cloudbase = require('@cloudbase/node-sdk');

const app = cloudbase.init({
  env: 'atom-2gbnzw0gde4242dc',
});

const dbCase = app.database().collection('Cases');
const dbNotice = app.database().collection('Notice');

const CaseStatus = {
  AGREE: 0,
  WAITING: 1,
  REJECT: 2,
};

const noticeState = {
  unReade: 0,
  read: 1,
};

const noticeType = {
  approve: 'approve',
  msg: 'msg',
  approveResult: 'approveResult', // 审批结果通知
};

const approveAgree = async (id, approverId, approveState, approveMsg) => {
  await dbCase.doc(id).update({
    approveStatus: approveState,
    approverId,
    approveMsg,
    approveTime: new Date(),
  });
  await addNotice(id, approveState);
  await cleanNotice(id);
};

// 添加审批结果通知
const addNotice = async (caseId, approveState) => {
  const res = await dbCase.doc(caseId).get();
  const resCase = res.data[0];
  const notice = {
    title: '立案审批结果',
    openId: resCase.undertaker,
    msg:
      approveState === CaseStatus.AGREE
        ? '立案审批已经通过'
        : '立案审批未通过,点击查看原因',
    caseId: caseId,
    state: noticeState.unReade,
    createTime: new Date(),
    type: noticeType.approveResult,
  };
  dbNotice.add(notice);
};

// 清除关联同一个案件的审批通知
const cleanNotice = async (caseId) => {
  const res = await dbNotice
    .where({
      type: noticeType.approve,
      caseId: caseId,
    })
    .get();
  res.data.forEach((item) => {
    dbNotice.doc(item._id).update({
      state: noticeState.read,
    });
  });
};

exports.main = async ({ approverId, idList, approveState, approveMsg }) =>
  await Promise.all(
    idList.map((id) => approveAgree(id, approverId, approveState, approveMsg)),
  );
