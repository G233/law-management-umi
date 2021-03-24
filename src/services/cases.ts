import { message } from 'antd';
import type { ActionType } from '@ant-design/pro-table';

import { db, cloudApp } from '@/cloud_function/index';
import { cloudFunction, cloudWhere, cloudFIndById } from '@/services/until';
import { CaseCauseId } from '@/services/const';

// 原本类型定义都是写在 @/typing.d.ts 里面的，但是 没办法引用 CasesStatus 因为我不知道怎么把 enum 导出
// 所以就拆出来写在这里了
export enum CaseStatus {
  AGREE,
  WAITING,
  REJECT,
}

//  民事 / 刑事 / 行政
export enum CaseType {
  Civil,
  Criminal,
  Administrative,
}

export const CaseStatusText = {
  [CaseStatus.AGREE]: '审批通过',
  [CaseStatus.WAITING]: '等待审批中',
  [CaseStatus.REJECT]: '拒绝审批',
};

export const CaseTypeText = {
  [CaseType.Civil]: '民事案件',
  [CaseType.Criminal]: '刑事案件',
  [CaseType.Administrative]: '行政案件',
};

// 案件属性
export interface Case {
  // 案由：
  //TODO: 是否有一个限定的范围？ 可以考虑从现有的数据库中取选项
  caseCause: string;
  // 当事人名称
  litigant: string;
  // 当事人联系方式
  litigantPhone: string;
  // 当事人基本情况
  litigantSituation?: string;
  // 委托人基本要求
  clientSituation?: string;
  // 案件基本情况
  caseSituation?: string;
  // 承办人基本意见
  undertakerOpinion?: string;
  // 立案时间
  createTime: Date;
  // 承办律师
  undertaker: string;
  // 案号
  // TODO: 根据类型自动生成案号
  caseId: string;
  // 审批状态
  approvestatus: CaseStatus;
  // 审批意见
  approveMsg: string;
  // 审批人
  approver: string;
  // 审批时间
  approverTime: Date;
  // 案件类别
  CaseType: CaseType;
  // 附件
  annex: string;
}

// 案件属性
export interface Cases {
  // 案件名
  title: string;
  // 涉案金额
  amount?: string;
  // 发起时间
  createTime: Date;
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

  // 审批人的 openid
  approverId?: string;
  // 审批通过时间
  approveTime?: Date;
  // 审批意见
  approveMsg?: string;

  // 向数据库插入数据的时候会自动添加
  _id?: string;
  _openid?: string;
}

const dbCase = db.collection('Cases');
const dbCache = db.collection('Cache');

// 获取所有待审批案件
// 默认为 100 条，需要手动去云函数中修改限制
export const fetchApprovingCases = async () => {
  const res = await cloudFunction('get_approving_cases');
  return {
    data: res ?? [],
    success: true,
  };
};

// 获取 一个月内审批过的案件
// 同样限制为 100 条
export const fetchApprovedCases = async () => {
  const res = await cloudApp
    .callFunction({
      name: 'get_approved_cases',
    })
    .catch((error) => {
      console.log(error);
    });
  if (res) {
    return {
      data: res?.result,
      success: true,
    };
  }
  message.error('审批列表获取失败，请稍后重试');
  return { data: [], success: true };
};

// 获取我的案件
export const fetchMyCases = async (openId: string) => {
  console.log(openId);
  const res = await cloudApp
    .callFunction({
      name: 'get_my_cases',
      data: { openId },
    })
    .catch((error) => {
      console.log(error);
    });
  if (res) {
    console.log(res);
    return {
      data: res?.result,
      success: true,
    };
  }
  message.error('审批列表获取失败，请稍后重试');
  return { data: [], success: true };
};

// 格式化案件，添加附加信息
const formatCase = (value: Cases) => {
  value.createTime = new Date();
  value.status = CaseStatus.WAITING;
  console.log(value);
  return value;
};

// 新建审批
export const createCase = async (value: Cases) => {
  await dbCase.add(formatCase(value));
  message.success('新建成功，等待审批中');
};

// 新建一百个案件，测试用 mock 数据
// export const createCase = async (value: Cases) => {
//   for (let i = 0; i < 100; i++) {
//     dbCase.add(await formatCase(value));
//   }
//     message.success('新建成功，等待审批中');

// };

// 一键审批，只有拒绝审批需要填写审批意见
export const oneClickApprove = async (
  idList: string[],
  fn: React.MutableRefObject<ActionType>,
  approverId: string,
  approveState: CaseStatus,
  approveMsg?: string,
) => {
  console.log({ idList, approverId, approveState, approveMsg });
  // 因为云数据库没有批量更新的 api ，出于性能考虑，把批量操作给云函数处理。不过我本地测试使用 http2 更新 20 个案件速度也很快
  const res = await cloudApp
    .callFunction({
      name: 'one_click_approve',
      data: { idList, approverId, approveState, approveMsg },
    })
    .catch(() => {
      message.error('请求出错，请稍后重试');
    });

  if (res) {
    // @ts-ignore
    // 重载表格
    fn.current.reloadAndRest();
    message.success('审批成功');
  }
};

export const fetchCaseCauseList = async () => {
  const res = await cloudFIndById('Cache', CaseCauseId);
  debugger;
  return res.caseCauseList.map((e) => {
    return { value: e };
  });
};
