const cloudbase = require('@cloudbase/node-sdk');

const CaseStatus = {
  AGREE: 0,
  WAITING: 1,
  REJECT: 2,
};

const app = cloudbase.init({
  env: 'atom-2gbnzw0gde4242dc',
});
const db = app.database();

exports.main = async () => {
  const res = await db
    .collection('Cases')
    .where({
      status: CaseStatus.WAITING,
    })
    .orderBy('createTime', 'asc')
    .get();
  return res;
};
