const cloudbase = require('@cloudbase/node-sdk');

const db = cloudbase
  .init({
    env: 'atom-2gbnzw0gde4242dc',
  })
  .database();

exports.main = async () => {
  const res = await db
    .collection('Advisory')
    .aggregate()
    .limit(1000)
    .sort({
      createTime: -1,
    })
    // 获取律师的名字
    .lookup({
      from: 'User',
      localField: '_openid',
      foreignField: '_openid',
      as: 'User',
    })
    .addFields({
      userName: '$User.name',
    })
    .project({
      User: 0,
    })
    .end();
  return res;
};
