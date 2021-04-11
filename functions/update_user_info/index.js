const cloudbase = require('@cloudbase/node-sdk');

const app = cloudbase.init({
  env: 'atom-2gbnzw0gde4242dc',
});

const db = app.database();
const _ = db.command;

exports.main = async (data) => {
  return await db.collection('User').doc(data._id).update({
    name: data.name,
    phone: data.phone,
    role: data.role,
  });
};
