import { message } from 'antd';
import type { ActionType } from '@ant-design/pro-table';

import { db, cloudApp } from '@/cloud_function/index';
import {
  cloudFunction,
  cloudFIndById,
  cloudUpdateById,
  cloudWhere,
} from '@/services/until';
import { CaseCauseId, CaseIdCacheId } from '@/services/const';

// 云储存中储存案件附件的文件夹名
const CasePath = 'caseAnnex';
const _ = db.command;

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
  [CaseStatus.REJECT]: '审批没通过',
};

export const CaseStatusColor = {
  [CaseStatus.AGREE]: 'green',
  [CaseStatus.WAITING]: 'blue',
  [CaseStatus.REJECT]: 'volcano',
};

export const CaseTypeText = {
  [CaseType.Civil]: '民事案件',
  [CaseType.Criminal]: '刑事案件',
  [CaseType.Administrative]: '行政案件',
};

export const caseIdText = {
  [CaseType.Civil]: '民代',
  [CaseType.Criminal]: '刑辩',
  [CaseType.Administrative]: '行代',
};

// 案件属性
export interface Case {
  // 案由：
  caseCause: string;
  // 委托当事人姓名(名称)
  litigant: string;
  // 对方当事人姓名(名称)
  otherlitigant: string;
  // 委托当事人联系方式
  litigantPhone: string;
  // 委托当事人基本情况
  litigantSituation?: string;
  // 对方当事人基本情况
  otherLitigantSituation?: string;
  // 委托人基本要求
  clientSituation?: string;
  // 案件基本情况
  caseSituation?: string;
  // 承办律师
  undertaker: string;
  // 承办人基本意见
  undertakerOpinion?: string;
  // 立案时间
  createTime: Date;
  // 案号
  caseId: string;

  // 审批状态
  approveStatus: CaseStatus;
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
  // 向数据库插入数据的时候会自动添加
  _id?: string;
  _openid?: string;
}

export interface requestProp {
  current?: number;
  pageSize?: number;
  openId?: string;
}

const condition = {
  // 获取三个月内审批过的案件
  approvedCases: 'approvedCases',
};

const dbUser = db.collection('User');
/**
 * 获取所有待审批案件
 */
export const fetchApprovingCases = async (data: requestProp) => {
  const res = await cloudFunction('get_case_list', {
    ...data,
    condition: { approveStatus: CaseStatus.WAITING },
  });

  return {
    data: res.caseList ?? [],
    success: true,
    total: res.count,
  };
};

/**
 * 获取 一个月内审批过的案件
 */
export const fetchApprovedCases = async (data: requestProp) => {
  const res = await cloudFunction('get_case_list', {
    ...data,
    condition: condition.approvedCases,
  });
  return {
    data: res.caseList ?? [],
    success: true,
    total: res.count,
  };
};

/**
 *  获取所有我的案件
 */

export const fetchMyCases = async (data: any) => {
  let condition = {
    undertaker: data.openId,
  };
  // 我的案件是查看所有通过审批了的案件,未通过审批的需要在 审批案件 中查看
  if (data.tag !== 'all') {
    // @ts-ignore
    condition.approveStatus = CaseStatus.AGREE;
  }

  const res = await cloudFunction('get_case_list', {
    ...data,
    condition,
  });

  return {
    data: res.caseList ?? [],
    success: true,
    total: res.count,
  };
};
/**
 *  获取所有审批通过了的案件
 */

export const fetchCaseList = async (data: requestProp) => {
  const res = await cloudFunction('get_case_list', {
    ...data,
    condition: { approveStatus: CaseStatus.AGREE },
  });
  return {
    data: res.caseList ?? [],
    success: true,
    total: res.count,
  };
};
/**
 *  新建审批
 */
export const createCase = async (value: Case) => {
  await cloudFunction('create_case', await generatedCaseId(value));
  message.success('新建成功，等待审批中');
};
// // 新建一百个案件，测试用 mock 数据
// export const createCase = async (value: Case) => {
//   for (let i = 0; i < 300; i++) {
//     await cloudFunction('create_case', await generatedCaseId(value));
//   }
//   message.success('新建成功，等待审批中');
// };
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
  return res?.caseCauseList?.map((e: string) => {
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
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        onProgress({ percent: percentCompleted }, file);
      },
    })
    .catch(onError);
  onSuccess(res?.fileID, file);
  message.success('附件上传成功');
  return {
    abort() {
      console.log('upload progress is aborted.');
    },
  };
};

// 下载附件
export const downloadFile = async (file: any) => {
  await cloudApp
    .downloadFile({
      fileID: file.response,
    })
    .catch((e) => {});
  message.success('附件开始下载');
};

// 自动生成案号
// (2021）河清民代 1 号
// (2021）河清行代 1 号
// (2021）河清刑辩 1 号
export const generatedCaseId = async (Case: Case) => {
  const year = new Date().getFullYear();
  const res = await cloudFIndById('Cache', CaseIdCacheId);
  let caseIdNum: number;
  const iCaseType = Case.CaseType;
  // TODO: 可以优化为事务
  // 当年还没有案号数据，新建
  if (!res[year]) {
    await cloudUpdateById('Cache', CaseIdCacheId, {
      [year]: {
        [CaseType.Civil]: iCaseType === CaseType.Civil ? 1 : 0,
        [CaseType.Criminal]: iCaseType === CaseType.Criminal ? 1 : 0,
        [CaseType.Administrative]:
          iCaseType === CaseType.Administrative ? 1 : 0,
      },
    });
    caseIdNum = 1;
  } else {
    caseIdNum = res[year][Case.CaseType] + 1;
    await cloudUpdateById('Cache', CaseIdCacheId, {
      [year]: {
        [iCaseType]: _.inc(1),
      },
    });
  }

  Case.caseId = `（${year}）河清${caseIdText[Case.CaseType]} ${caseIdNum} 号`;

  return Case;
};

export const findUserIdByName = async (name: string) => {
  const res = await cloudWhere('User', { name: name });
  console.log(res[0]._openid);
  return res[0]._openid;
};
