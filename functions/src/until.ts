import * as cloudbase from '@cloudbase/node-sdk';
import { isDev } from './index';
// 云开发相关函数
export const db = cloudbase
  .init({
    env: isDev ? 'atom-2gbnzw0gde4242dc' : 'law-build-8gty78990cd939d6',
  })
  .database();

export const _ = db.command;

// 枚举
export enum CaseStatus {
  AGREE,
  WAITING,
  REJECT,
}

export enum noticeType {
  approve = 'approve', // 有人发起审批
  approveResult = 'approveResult', // 审批结果
  msg = 'msg',
}

export enum noticeState {
  unReade,
  read,
}

// 案件类别，分为 民事 / 刑事 / 行政
export enum CaseType {
  Civil,
  Criminal,
  Administrative,
}
