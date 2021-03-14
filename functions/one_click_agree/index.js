// 一键通过审批
const cloudbase = require('@cloudbase/node-sdk');

const CaseStatus = {
  AGREE: 0,
  WAITING: 1,
  REJECT: 2,
};
const app = cloudbase.init({
  env: 'atom-2gbnzw0gde4242dc',
});
const dbCase = app.database().collection('Cases');

const approveAgree = async (id, approverId) => {
  await dbCase
    .doc(id)
    .update({ status: CaseStatus.AGREE, approverId, approveTime: new Date() });
};

exports.main = async ({ approverId, idList }) => {
  await Promise.all(
    idList.forEach(async (id) => {
      await approveAgree(id, approverId);
    }),
  );
};
