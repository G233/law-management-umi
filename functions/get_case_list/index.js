const cloudbase = require('@cloudbase/node-sdk');

const CaseStatus = {
  AGREE: 0,
  WAITING: 1,
  REJECT: 2,
};
// 获取所有的案件(带条件查询)
const db = cloudbase
  .init({
    env: 'atom-2gbnzw0gde4242dc',
  })
  .database();

exports.main = async ({ current, pageSize }) => {
  const res = await db
    .collection('Cases')
    // 不加 limit 默认返回 20 个，需要注意
    .aggregate()
    .match({
      approveStatus: CaseStatus.AGREE,
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
    .project({
      undertaker: 0,
    })
    .end();
  const resCount = await db
    .collection('Cases')
    .aggregate()
    .match({
      approveStatus: CaseStatus.AGREE,
    })
    .count('count')
    .end();
  return {
    caseList: res.data,
    count: resCount.data[0] && resCount.data[0].count,
  };
};
