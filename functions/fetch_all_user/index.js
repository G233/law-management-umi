const cloudbase = require('@cloudbase/node-sdk');

const db = cloudbase
  .init({
    env: 'atom-2gbnzw0gde4242dc',
  })
  .database();

exports.main = async () => {
  const res = await db
    .collection('User')
    .aggregate()
    .match({
      role: 'user',
    })
    .limit(1000)
    .end();
  return res;
};
