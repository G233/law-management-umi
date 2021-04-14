import { message } from 'antd';
import type { ActionType } from '@ant-design/pro-table';

import { db, cloudApp } from '@/cloud_function/index';
import {
  cloudFunction,
  cloudFIndById,
  cloudUpdateById,
  cloudWhere,
  cloudAdd,
} from '@/services/until';
import { CaseCauseId, CaseIdCacheId } from '@/services/const';

const _ = db.command;
const dbNotice = db.collection('Notice');

export enum noticeState {
  unReade,
  read,
}

export enum noticeType {
  'approve' = 'approve', // 有人发起审批
  'approveResult' = 'approveResult', // 审批结果
  'msg' = 'msg',
}

export interface Notice {
  title: string;
  openId: string;
  msg: string;
  caseId: string;
  state: noticeState;
  type: noticeType;
  createTime: Date | string;
  _id?: string;
}

export const addNotice = async (data: Notice) => {
  const res = await cloudAdd('Notice', data);
};

export const readNotice = async (item: Notice) => {
  await cloudUpdateById('Notice', item._id as string, {
    state: noticeState.read,
  });
};

export const getNotices = async (id: string) => {
  const res = await cloudWhere(
    'Notice',
    { openId: id, state: noticeState.unReade },
    true,
  );
  return res;
};
