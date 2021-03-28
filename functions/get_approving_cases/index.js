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
const $ = db.command.aggregate;
const _ = db.command;

exports.main = async () => {
  const res = await db
    .collection('Cases')
    .aggregate()
    // 不加 limit 默认返回 20 个，需要注意
    .limit(100)
    .match({
      status: CaseStatus.WAITING,
    })
    .sort({
      createTime: -1,
    })
    // 获取案件提交人的名字
    .lookup({
      from: 'User',
      localField: '_openid',
      foreignField: '_openid',
      as: 'commiter',
    })
    // 获取承办律师的名字
    .lookup({
      from: 'User',
      localField: 'undertaker',
      foreignField: '_openid',
      as: 'undertakerName',
    })
    .addFields({
      commiterName: '$commiter.name',
      undertakerName: '$undertakerName.name',
    })
    .project({
      commiter: 0,
    })
    .end();
  return res.data.map((e) => {
    e.commiterName = e.commiterName[0];
    return e;
  });
};
