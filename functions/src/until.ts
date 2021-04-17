import * as cloudbase from '@cloudbase/node-sdk';

// 云开发相关函数
export const db = cloudbase
  .init({
    env: 'atom-2gbnzw0gde4242dc',
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
