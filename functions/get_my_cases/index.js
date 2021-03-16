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

// 一个对列表使用异步函数的示例
// await Promise.all(
//   files.map(async (file) => {
//     const contents = await fs.readFile(file, 'utf8');
//     console.log(contents);
//   }),
// );

exports.main = async ({ openId }) => {
  const res = await db
    .collection('Cases')
    .where({
      _openid: openId,
    })
    .orderBy('createTime', 'asc')
    .get();

  await Promise.all(
    res.data.map(async (e) => {
      // 还未审批的案件没有审批人
      if (e.approverId) {
        const res = await db
          .collection('User')
          .where({
            _openid: e.approverId || '',
          })
          .get();
        e.approverName = res.data[0].name;
      }
    }),
  );
  return res.data;
};
