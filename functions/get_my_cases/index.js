// TODO： 是否可以把查询条件当作条件查询，构建一个通用的查询函数

const cloudbase = require('@cloudbase/node-sdk');

// 获取所有审批中的案件
const db = cloudbase
  .init({
    env: 'atom-2gbnzw0gde4242dc',
  })
  .database();

exports.main = async ({ openId, current, pageSize }) => {
  const res = await db
    .collection('Cases')
    // 不加 limit 默认返回 20 个，需要注意
    .aggregate()
    .match({
      undertaker: openId,
    })
    .sort({
      createTime: -1,
    })
    .skip((current - 1) * pageSize)
    .limit(pageSize)
    // 获取案件审批人的名字
    .lookup({
      from: 'User',
      localField: 'approverId',
      foreignField: '_openid',
      as: 'approver',
    })
    .addFields({
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
      undertaker: openId,
    })
    .count('count')
    .end();
  return {
    caseList: res.data,
    count: resCount.data[0] && resCount.data[0].count,
  };
};
