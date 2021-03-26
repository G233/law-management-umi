import { message } from 'antd';
import type { ActionType } from '@ant-design/pro-table';

import { db, cloudApp } from '@/cloud_function/index';
import { cloudFunction, cloudFIndById } from '@/services/until';
import { CaseCauseId } from '@/services/const';

// 云储存中储存案件附件的文件夹名
const CasePath = 'caseAnnex';

export enum CaseStatus {
  AGREE,
  WAITING,
  REJECT,
}

// 案件类别，分为 民事 / 刑事 / 行政
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

const dbUser = db.collection('User');

/**
 * 获取所有待审批案件，默认为 100 条，需要手动去云函数中修改限制
 */
export const fetchApprovingCases = async () => ({
  data: (await cloudFunction('get_approving_cases')) ?? [],
  success: true,
});

/**
 *  获取 一个月内审批过的案件，同样限制为 100 条
 */
export const fetchApprovedCases = async () => ({
  data: (await cloudFunction('get_approved_cases')) ?? [],
  success: true,
});

/**
 *  获取所有我的案件
 * @param {string} openId - 当前登陆用户的 openId.
 */
export const fetchMyCases = async (openId: string) => ({
  data: (await cloudFunction('get_my_cases', { openId })) ?? [],
  success: true,
});

/**
 *  新建审批
 */
export const createCase = async (value: Case) => {
  await cloudFunction('create_case', value);
  message.success('新建成功，等待审批中');
};

/**
 *  一键审批
 */
export const oneClickApprove = async (
  idList: string[],
  fn: React.MutableRefObject<ActionType>,
  approverId: string,
  approveState: CaseStatus,
  approveMsg?: string,
) => {
  // 因为云数据库没有批量更新的 api ，出于性能考虑，把批量操作给云函数处理。不过我本地测试使用 http2 更新 20 个案件速度也很快
  const res = await cloudFunction('one_click_approve', {
    idList,
    approverId,
    approveState,
    approveMsg,
  });

  if (res) {
    // @ts-ignore
    // 重载表格
    fn.current.reloadAndRest();
    message.success('审批完成');
  }
};

/**
 * 获取案由列表，用于案由输入框的自动完成
 */
export const fetchCaseCauseList = async () => {
  const res = await cloudFIndById('Cache', CaseCauseId);
  return res.caseCauseList.map((e: string) => {
    return { value: e };
  });
};

/**
 * 获取所有律师，用于承办律师的自动完成
 */
export const fetchLawList = async () => {
  const res = await dbUser.get();
  return res.data.map((e: any) => ({ value: e._openid, label: e.name }));
};

/**
 * 上传附件
 */
export const uploadFile = async (data: any, openId: string) => {
  const { file, onError, onProgress, onSuccess } = data;
  const res = await cloudApp
    .uploadFile({
      cloudPath: `${CasePath}/${openId}/${file.name}`,
      filePath: file,
      onUploadProgress: (progressEvent: any) => {
        console.log(progressEvent);
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        onProgress({ percent: percentCompleted }, file);
      },
    })
    .catch(onError);
  onSuccess(res?.fileID, file);
  return {
    abort() {
      console.log('upload progress is aborted.');
    },
  };
};

export const downloadFile = async (file: any) => {
  await cloudApp
    .downloadFile({
      fileID: file.response,
    })
    .catch((e) => {});
  message.success('文件开始下载了');
};

// 新建一百个案件，测试用 mock 数据
// export const createCase = async (value: Cases) => {
//   for (let i = 0; i < 100; i++) {
//     dbCase.add(await formatCase(value));
//   }
//     message.success('新建成功，等待审批中');

// };
