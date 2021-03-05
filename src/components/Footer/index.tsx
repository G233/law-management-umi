import React from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright="AtomLiu"
    links={[
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/G233',
        blankTarget: true,
      },
      {
        key: '湖南河清律师事务所',
        title: '湖南河清律师事务所',
        href: 'https://github.com/G233',
        blankTarget: true,
      },
      {
        key: 'AtomLiu',
        title: 'AtomLiu',
        href: 'https://github.com/G233',
        blankTarget: true,
      },
    ]}
  />
);
