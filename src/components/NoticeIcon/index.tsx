import { useEffect, useState } from 'react';
import { message } from 'antd';
import moment from 'moment';
import { useModel, history } from 'umi';
import {
  getNotices,
  Notice,
  noticeState,
  noticeType,
  readNotice,
} from '@/services/notice';

import NoticeIcon from './NoticeIcon';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};

// 将 api 返回的数据,格式化为 ui 需要的数据格式
const getNoticeData = (notices: Notice[]): Notice[] => {
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

// 获取未读消息数量
const getUnreadData = (noticeData: Notice[]) =>
  noticeData.reduce(
    (accumulator, notice) =>
      accumulator + (notice.state === noticeState.unReade ? 1 : 0),
    0,
  );

const NoticeIconView = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [notices, setNotices] = useState<Notice[]>([]);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    getNotices(currentUser?.uid as string).then((res: Notice[]) =>
      setNotices(res ?? []),
    );
  }, []);

  const noticeData = getNoticeData(notices);
  const unreadMsgCount = getUnreadData(noticeData || []);

  const changeReadState = (id: string) => {
    setNotices(
      notices.map((item) => {
        const notice = { ...item };
        if (notice._id === id) {
          notice.state = noticeState.read;
          console.log('aaa');
          readNotice(item);
        }
        return notice;
      }),
    );
  };

  const clearReadState = () => {
    setNotices(
      notices.map((item) => {
        const notice = { ...item };
        notice.state = noticeState.read;
        readNotice(item);
        return notice;
      }),
    );
    message.success('已清空所有通知');
  };

  return (
    <NoticeIcon
      className={styles.action}
      count={unreadMsgCount}
      onPopupVisibleChange={setPopupVisible}
      popupVisible={popupVisible}
      onItemClick={(item) => {
        if (item.state === noticeState.read) return;
        changeReadState(item._id!);
        history.push(
          item.type === noticeType.approve ? '/CaseApprove' : '/My/approveCase',
        );
        setPopupVisible(false);
      }}
      onClear={clearReadState}
      loading={false}
      clearText="一键已读"
      viewMoreText="查看更多"
      clearClose
    >
      <NoticeIcon.Tab
        tabKey={noticeType.approve}
        list={noticeData}
        emptyText="没有新的通知"
      />
    </NoticeIcon>
  );
};

export default NoticeIconView;
