const cloudbase = require('@cloudbase/node-sdk');

const app = cloudbase.init({
  env: 'atom-2gbnzw0gde4242dc',
});
const db = app.database();
const _ = db.command;

const CaseStatus = {
  AGREE: 0,
  WAITING: 1,
  REJECT: 2,
};

// 获取三十天内完成的审批
const now = new Date();
let oldDate = new Date(now.setDate(now.getDate() - 30));

exports.main = async () => {
  const res = await db
    .collection('Cases')
    .where({
      status: _.or(_.eq(CaseStatus.REJECT), _.eq(CaseStatus.AGREE)),
      approveTime: _.gt(oldDate),
    })
    .orderBy('createTime', 'asc')
    .get();

  // TODO: 优化为通过聚合
  await Promise.all(
    res.data.map(async (e) => {
      const res = await db
        .collection('User')
        .where({
          _openid: e.approverId,
        })
        .get();
      e.approverName = res.data[0].name;
    }),
  );
  return res.data;
};
