const cloudbase = require('@cloudbase/node-sdk');

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

// 当前案由没有在缓存中就添加
const updateCaseCause = async (Case) => {
  const caseCauseCache = db.collection('Cache').doc(CaseCauseId);
  const Cache = await caseCauseCache.get();
  if (Cache.data[0].caseCauseList.indexOf(Case.caseCause) !== -1) return;
  await caseCauseCache
    .update({
      caseCauseList: _.push(Case.caseCause),
    })
    .catch((e) => e);
};

const formatCase = (value) => {
  value.createTime = new Date();
  value.approveStatus = CaseStatus.WAITING;
  return value;
};

exports.main = async (Case) => {
  updateCaseCause(Case);
  return await db.collection('Cases').add(formatCase(Case));
};
