import { db } from '@/cloud_function/index';

// 原本类型定义都是写在 @/typing.d.ts 里面的，但是 没办法引用 CasesStatus 因为我不知道怎么把 enum 导出
// 所以就拆出来写在这里了
export enum CaseStatus {
  'AGREE',
  'WAITING',
  'REJECT',
}
// 案件属性
export interface Cases {
  // 案件名
  title: string;
  // 涉案金额
  amount?: string;
  // 发起时间
  newTime: Date;
  // 审批状态
  status: CaseStatus;
  // 收费
  toll: string;
  // 被告人
  Defendant: string;
  // 当事人
  litigant: string;
  // 案件描述
  description: string;
  // 向数据库插入数据的时候会自动添加
  _id?: string;
  _openid?: string;
}

export const createCase = async (value: Cases) => {
  for (let i = 0; i < 100; i++) {
    db.collection('Cases').add(await formatCase(value));
  }
};

const formatCase = async (value: Cases) => {
  value.newTime = new Date();
  value.status = CaseStatus.WAITING;
  console.log(value);
  return value;
};

// 测试用 mock 数据
// export const createCase = async (value: Cases) => {
//   for (let i = 0; i < 100; i++) {
//     db.collection('Cases').add(await formatCase(value));
//   }
// };
