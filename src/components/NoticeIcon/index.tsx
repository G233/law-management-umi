import { useEffect, useState } from 'react';
import { message } from 'antd';
import { useUnmountedRef } from 'ahooks';

import { useModel, history } from 'umi';
import {
  getNotices,
  Notice,
  noticeState,
  noticeType,
  readNotice,
  getNoticeData,
  getUnreadData,
} from '@/services/notice';

import NoticeIcon from './NoticeIcon';
import styles from './index.less';

const NoticeIconView = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [notices, setNotices] = useState<Notice[]>([]);
  const unmountRef: { current: boolean } = useUnmountedRef();
  const [noticeData, setNoticeData] = useState<Notice[]>([]);
  const [unreadMsgCount, setUnreadMsgCount] = useState<number>();
  const [popupVisible, setPopupVisible] = useState(false);
  let didCancel = false;

  const initData = async () => {
    const res: Notice[] = await getNotices(currentUser?.uid as string);
    const noticeData = getNoticeData(res);
    const unreadMsgCount = getUnreadData(noticeData || []);
    // 若函数组件已经背卸载就不设置数据了
    if (!unmountRef.current) {
      setUnreadMsgCount(unreadMsgCount ?? []);
      setNotices(res ?? []);
      setNoticeData(noticeData ?? []);
    }
  };

  useEffect(() => {
    initData();
  }, []);

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
