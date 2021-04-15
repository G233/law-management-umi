import React from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright="AtomLiu"
    links={[
      {
        key: '湖南河清律师事务所',
        title: '湖南河清律师事务所',
        href: 'http://law.liuxiaogu.com',
        blankTarget: true,
      },
      {
        key: 'AtomLiu',
        title: '刘固开发',
        href: 'https://github.com/G233',
        blankTarget: true,
      },
    ]}
  />
);
