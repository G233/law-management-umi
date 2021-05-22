import moment from 'moment';

import { cloudUpdateById, cloudWhere } from '@/services/until';

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
  unionId: string;
  msg: string;
  caseId: string;
  state: noticeState;
  type: noticeType;
  createTime: Date | string;
  _id?: string;
}

export const readNotice = async (item: Notice) => {
  await cloudUpdateById('Notice', item._id as string, {
    state: noticeState.read,
  });
};

// 将 api 返回的数据,格式化为 ui 需要的数据格式
export const getNoticeData = (notices: Notice[]): Notice[] => {
  if (!notices || notices.length === 0 || !Array.isArray(notices)) {
    return [];
  }
  const newNotices = notices.map((notice) => {
    const newNotice = { ...notice };
    // 把时间格式化为相对时间
    if (newNotice.createTime) {
      moment.locale('zh-cn');
      newNotice.createTime = moment(notice.createTime).fromNow();
    }
    return newNotice;
  });

  return newNotices;
};

// 获取通知消息
export const getNotices = async (unionId: string) => {
  const res = await cloudWhere(
    'Notice',
    { unionId: unionId, state: noticeState.unReade },
    true,
  );
  return res;
};
// 获取未读消息数量
export const getUnreadData = (noticeData: Notice[]) =>
  noticeData.reduce(
    (accumulator, notice) =>
      accumulator + (notice.state === noticeState.unReade ? 1 : 0),
    0,
  );
