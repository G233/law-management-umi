// TODO： 是否可以把查询条件当作条件查询，构建一个通用的查询函数

const cloudbase = require('@cloudbase/node-sdk');

// 获取所有审批中的案件
const db = cloudbase
  .init({
    env: 'atom-2gbnzw0gde4242dc',
  })
  .database();

exports.main = async ({ openId }) => {
  const res = await db
    .collection('Cases')
    // 不加 limit 默认返回 20 个，需要注意
    .aggregate()
    .limit(100)
    .match({
      _openid: openId,
    })
    .sort({
      createTime: -1,
    })
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
  return res.data.map((e) => {
    e.approverName = e.approverName[0];
    return e;
  });
};
