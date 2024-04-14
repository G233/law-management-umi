import React, { useCallback } from 'react';
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { history, useModel } from '@umijs/max';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { signOut } from '../../services/user';
import { provider } from '@/cloud_function';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await signOut();
  // 导航到微信扫码登陆页面
  provider.signInWithRedirect();
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState, loading } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        setInitialState({ ...initialState, currentUser: null });
        loginOut();
        return;
      }
      if (key === 'center') {
        history.push(`/My`);
      }
      if (key === 'settings') {
        history.push(`/setting`);
      }
    },
    [initialState, setInitialState],
  );

  const Loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return Loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown menu={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={
            initialState?.currentUser?.avatarUrl ||
            'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
          }
          alt="avatar"
        />
        <span className={`${styles.name} anticon`}>
          {`${
            initialState?.currentUser?.name ??
            initialState?.currentUser?.nickName
          }  你好`}
        </span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
