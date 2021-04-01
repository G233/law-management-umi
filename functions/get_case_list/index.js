const cloudbase = require('@cloudbase/node-sdk');

const db = cloudbase
  .init({
    env: 'atom-2gbnzw0gde4242dc',
  })
  .database();

const CaseStatus = {
  AGREE: 0,
  WAITING: 1,
  REJECT: 2,
};

const now = new Date();
let oldDate = new Date(now.setDate(now.getDate() - 30));

const { gt, eq, or, neq } = db.command.aggregate;

// 一些特殊的查询条件
const ConditionList = {
  // 获取三个月内审批过的案件
  approvedCases: {
    approveStatus: neq(CaseStatus.WAITING),
    approveTime: gt(oldDate),
  },
};

exports.main = async ({
  current,
  pageSize,
  condition,
  caseCause,
  litigant,
  undertaker,
  caseSituation,
  caseId,
  CaseType,
}) => {
  const conditionI =
    typeof condition === 'string'
      ? ConditionList[condition]
      : {
          ...condition,
          caseCause: new db.RegExp({
            regexp: `.*${caseCause || ''}.*`,
          }),
          litigant: new db.RegExp({
            regexp: `.*${litigant || ''}.*`,
          }),
          // undertakerName: new db.RegExp({
          //   regexp: `.*${undertakerName || ''}.*`,
          // }),
          caseSituation: new db.RegExp({
            regexp: `.*${caseSituation || ''}.*`,
          }),
          caseId: new db.RegExp({
            regexp: `.*${caseId || ''}.*`,
          }),
          undertaker: new db.RegExp({
            regexp: `.*${undertaker || ''}.*`,
          }),
        };
  if (CaseType) {
    conditionI['CaseType'] = Number(CaseType);
  }
  console.log(conditionI);
  console.log(conditionI);
  const res = await db
    .collection('Cases')
    .aggregate()
    .match(conditionI)
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
    // 获取审批律师的名字
    .lookup({
      from: 'User',
      localField: 'approverId',
      foreignField: '_openid',
      as: 'approver',
    })
    .addFields({
      undertakerName: '$undertaker.name',
      approverName: '$approver.name',
    })
    .project({
      undertaker: 0,
      approver: 0,
    })
    .end();
  const resCount = await db
    .collection('Cases')
    .aggregate()
    .match(conditionI)
    .count('count')
    .end();
  return {
    caseList: res.data,
    count: resCount.data[0] && resCount.data[0].count,
    rrr: conditionI,
  };
};
