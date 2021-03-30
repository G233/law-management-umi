const cloudbase = require('@cloudbase/node-sdk');

const app = cloudbase.init({
  env: 'atom-2gbnzw0gde4242dc',
});
const db = app.database();
const { gt, eq, or, neq } = db.command.aggregate;

const CaseStatus = {
  AGREE: 0,
  WAITING: 1,
  REJECT: 2,
};

// 获取三十天内完成的审批
const now = new Date();
let oldDate = new Date(now.setDate(now.getDate() - 30));

exports.main = async ({ current, pageSize }) => {
  const res = await db
    .collection('Cases')
    .aggregate()
    // 不加 limit 默认返回 20 个，需要注意
    .match({
      approveStatus: neq(CaseStatus.WAITING),
      approveTime: gt(oldDate),
    })
    .sort({
      createTime: -1,
    })
    .skip((current - 1) * pageSize)
    .limit(pageSize)
    // 获取审批律师的名字
    .lookup({
      from: 'User',
      localField: 'approverId',
      foreignField: '_openid',
      as: 'approver',
    })
    // 获取承办律师的名字
    .lookup({
      from: 'User',
      localField: 'undertaker',
      foreignField: '_openid',
      as: 'undertaker',
    })
    .addFields({
      undertakerName: '$undertaker.name',
      approverName: '$approver.name',
    })
    .project({
      approver: 0,
    })
    .end();

  const resCount = await db
    .collection('Cases')
    .aggregate()
    .match({
      approveStatus: neq(CaseStatus.WAITING),
      approveTime: gt(oldDate),
    })
    .count('count')
    .end();
  return {
    caseList: res.data,
    count: resCount.data[0] && resCount.data[0].count,
  };
};
