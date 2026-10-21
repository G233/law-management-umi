import { db, CaseType, CaseStatus } from './until';
import { escapeRegex } from './escape_regex';

const { gt, neq } = db.command.aggregate;

// 一些特殊的查询条件
// 注意：时间窗口在每次请求时计算，而不是模块加载时
const getConditionList = () => {
  const now = new Date();
  const oldDate = new Date(now.setDate(now.getDate() - 30));
  
  return {
    // 获取30天内审批过的案件
    approvedCases: {
      approveStatus: neq(CaseStatus.WAITING),
      approveTime: gt(oldDate),
    },
  };
};

interface requestProp {
  current: number;
  pageSize: number;
  condition: 'approvedCases' | object;
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
  const ConditionList = getConditionList();
  const conditionI =
    typeof condition === 'string' && condition === 'approvedCases'
      ? ConditionList[condition]
      : {
          //@ts-ignore

          caseCause: new db.RegExp({
            regexp: `.*${escapeRegex(caseCause || '')}.*`,
          }),
          //@ts-ignore

          litigant: new db.RegExp({
            regexp: `.*${escapeRegex(litigant || '')}.*`,
          }),
          // undertakerName: new db.RegExp({
          //   regexp: `.*${undertakerName || ''}.*`,
          // }),
          //@ts-ignore

          caseSituation: new db.RegExp({
            regexp: `.*${escapeRegex(caseSituation || '')}.*`,
          }),
          //@ts-ignore

          caseId: new db.RegExp({
            regexp: `.*${escapeRegex(caseId || '')}.*`,
          }),
          //@ts-ignore

          undertaker: new db.RegExp({
            regexp: `.*${escapeRegex(undertaker || '')}.*`,
          }),
          ...(condition as object),
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
      foreignField: 'unionId',
      as: 'undertaker',
    })
    // 获取审批律师的名字
    .lookup({
      from: 'User',
      localField: 'approverId',
      foreignField: 'unionId',
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

  res.data.map((e) => {
    (e.undertakerName = e.undertakerName[0]),
      (e.approverName = e.approverName[0]);
  });

  return {
    caseList: res.data,
    count: resCount.data[0] && resCount.data[0].count,
    conditionI,
  };
};

export { getCaseList };
