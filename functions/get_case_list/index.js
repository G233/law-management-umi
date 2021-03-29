const cloudbase = require('@cloudbase/node-sdk');

// 获取所有的案件(带条件查询)
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
    .sort({
      createTime: -1,
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
    })
    .project({
      undertaker: 0,
    })
    .end();
  return res.data;
};
