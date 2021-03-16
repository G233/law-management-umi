// TODO： 是否可以把查询条件当作条件查询，构建一个通用的查询函数

const cloudbase = require('@cloudbase/node-sdk');

const CaseStatus = {
  AGREE: 0,
  WAITING: 1,
  REJECT: 2,
};

// 获取所有审批中的案件
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
