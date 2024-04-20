import { Button, Result } from 'antd';
import React from 'react';
import { history } from '@umijs/max';

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="没有找到此页面"
    subTitle="抱歉, 您想访问的这个页面不存在呢~"
    extra={
      <Button type="primary" onClick={() => history.goBack()}>
        返回上个页面
      </Button>
    }
  />
);

export default NoFoundPage;
