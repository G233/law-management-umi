import { Tag, Space } from 'antd';
import React from 'react';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight: React.FC = () => {
  let className = styles.right;
  return (
    <Space className={className}>
      {/* 头像：退出登陆，修改姓名 */}
      <Avatar menu />
    </Space>
  );
};
export default GlobalHeaderRight;
