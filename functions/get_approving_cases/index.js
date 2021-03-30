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

exports.main = async ({ current, pageSize }) => {
  const res = await db
    .collection('Cases')
    .aggregate()
    // 不加 limit 默认返回 20 个，需要注意
    .match({
      approveStatus: CaseStatus.WAITING,
    })
    .sort({
      createTime: -1,
    })
    .skip((current - 1) * pageSize)
    .limit(pageSize)
    // 获取承办律师的名字
    .lookup({
      from: 'User',
      localField: 'undertaker',
      foreignField: '_openid',
      as: 'undertaker',
    })
    .addFields({
      undertakerName: '$undertaker.name',
    })
    .end();
  const resCount = await db
    .collection('Cases')
    .aggregate()
    .match({
      approveStatus: CaseStatus.WAITING,
    })
    .count('count')
    .end();
  return {
    caseList: res.data,
    count: resCount.data[0] && resCount.data[0].count,
  };
};
