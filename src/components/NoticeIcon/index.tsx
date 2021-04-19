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

import useSafeState from '@/hook/useSafeState/index';

import NoticeIcon from './NoticeIcon';
import styles from './index.less';

const NoticeIconView = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [notices, setNotices] = useSafeState<Notice[]>([]);
  const [noticeData, setNoticeData] = useSafeState<Notice[]>([]);
  const [unreadMsgCount, setUnreadMsgCount] = useSafeState<number>();
  const [popupVisible, setPopupVisible] = useSafeState(false);
  let didCancel = false;

  const initData = async () => {
    const res: Notice[] = await getNotices(currentUser?.uid as string);
    setNotices(res ?? []);
  };

  useEffect(() => {
    const noticeData = getNoticeData(notices);
    const unreadMsgCount = getUnreadData(noticeData || []);
    setUnreadMsgCount(unreadMsgCount ?? []);
    setNoticeData(noticeData ?? []);
  }, [notices]);

  useEffect(() => {
    initData();
  }, [currentUser?.uid]);

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
