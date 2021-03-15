// 一键审批函数
const cloudbase = require('@cloudbase/node-sdk');

const app = cloudbase.init({
  env: 'atom-2gbnzw0gde4242dc',
});

const dbCase = app.database().collection('Cases');

const approveAgree = async (id, approverId, approveState, approveMsg) => {
  await dbCase.doc(id).update({
    status: approveState,
    approverId,
    approveMsg,
    approveTime: new Date(),
  });
};

exports.main = async ({ approverId, idList, approveState, approveMsg }) =>
  await Promise.all(
    idList.map((id) => approveAgree(id, approverId, approveState, approveMsg)),
  );
