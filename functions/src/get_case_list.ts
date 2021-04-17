import { db, CaseType, CaseStatus } from './until';

const now = new Date();
const oldDate = new Date(now.setDate(now.getDate() - 30));
const { gt, neq } = db.command.aggregate;

// 一些特殊的查询条件
const ConditionList = {
  // 获取三个月内审批过的案件
  approvedCases: {
    approveStatus: neq(CaseStatus.WAITING),
    approveTime: gt(oldDate),
  },
};

interface requestProp {
  current: number;
  pageSize: number;
  condition: 'approvedCases' | Object;
  caseCause: string;
  litigant: string;
  undertaker: string;
  caseSituation: string;
  caseId: string;
  CaseType: CaseType;
}

const getCaseList = async ({
  current,
  pageSize,
  condition,
  caseCause,
  litigant,
  undertaker,
  caseSituation,
  caseId,
  CaseType,
}: requestProp) => {
  const conditionI =
    typeof condition === 'string' && condition === 'approvedCases'
      ? ConditionList[condition]
      : {
          //@ts-ignore

          caseCause: new db.RegExp({
            regexp: `.*${caseCause || ''}.*`,
          }),
          //@ts-ignore

          litigant: new db.RegExp({
            regexp: `.*${litigant || ''}.*`,
          }),
          // undertakerName: new db.RegExp({
          //   regexp: `.*${undertakerName || ''}.*`,
          // }),
          //@ts-ignore

          caseSituation: new db.RegExp({
            regexp: `.*${caseSituation || ''}.*`,
          }),
          //@ts-ignore

          caseId: new db.RegExp({
            regexp: `.*${caseId || ''}.*`,
          }),
          //@ts-ignore

          undertaker: new db.RegExp({
            regexp: `.*${undertaker || ''}.*`,
          }),
          ...(condition as Object),
        };
  if (CaseType) {
    // @ts-ignore
    conditionI['CaseType'] = Number(CaseType);
  }
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
    conditionI,
  };
};

export { getCaseList };
