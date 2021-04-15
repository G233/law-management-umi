const cloudbase = require('@cloudbase/node-sdk');

const db = cloudbase
  .init({
    env: 'atom-2gbnzw0gde4242dc',
  })
  .database();

exports.main = async ({ name, undertaker }) => {
  const res = await db
    .collection('Advisory')
    .aggregate()
    .match({
      name: new db.RegExp({
        regexp: `.*${name || ''}.*`,
      }),
      _openid: new db.RegExp({
        regexp: `.*${undertaker || ''}.*`,
      }),
    })
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
