import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Alert, message, Button } from 'antd';
import React, { useState } from 'react';
import { trim } from 'lodash';
import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import { Link, history, useModel } from 'umi';
import Footer from '@/components/Footer';

import styles from './index.less';
import { fetchUserInfo } from '@/services/user';
import { provider, auth } from '@/cloud_function';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

enum LoginStatus {
  'ERROR',
  'LODING',
}

const Login: React.FC = () => {
  interface LoginParams {
    userName?: string;
    password?: string;
    autoLogin?: boolean;
  }
  const [submitting, setSubmitting] = useState(false);
  const [loginStatus, setLoginStatus] = useState(LoginStatus.LODING);
  const { initialState, setInitialState } = useModel('@@initialState');

  // 用户登陆函数
  const handleSubmit = async (values: LoginParams) => {
    setSubmitting(true);

    const userInfo = await auth
      .signInWithUsernameAndPassword(
        values.userName as string,
        values.password as string,
      )
      .catch((err) => {
        // 登陆失败的情况包括密码错误与其他报错,因为云开发密码错误也是直接报错
        message.error('登录失败，请重试！');
        setLoginStatus(LoginStatus.ERROR);
      });

    if (userInfo && initialState) {
      // FIXME： 需要优化
      // 只运行一次会导致首次进入系统的时候,在 history.push('/') 之后，
      // onPageChange 函数拿不到新的 initialState，无法判断是否登陆，导致第一次无法进入管理页面
      const currentUser = await fetchUserInfo();
      setInitialState({ currentUser, hasLogin: true });
      setInitialState({ currentUser, hasLogin: true });
      history.push('/');
      return;
    }
    setSubmitting(false);
  };

  const loginByWx = () => {
    provider.signInWithRedirect();
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/logo.svg" />
              <span className={styles.title}>河清管理</span>
            </Link>
          </div>
          <div className={styles.desc}>湖南河清律师事务所管理系统</div>
        </div>

        <div className={styles.main}>
          <ProForm
            submitter={{
              searchConfig: {
                submitText: '登录',
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values as LoginParams);
            }}
          >
            {loginStatus === LoginStatus.ERROR && (
              <LoginMessage content="用户名或密码错误" />
            )}

            <ProFormText
              name="userName"
              fieldProps={{
                size: 'large',
                prefix: <MailOutlined className={styles.prefixIcon} />,
              }}
              placeholder="请输入用户名"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder="请输入密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
          </ProForm>
          <div>
            <Button
              onClick={loginByWx}
              block={true}
              type="default"
              className={styles.wxBtn}
            >
              使用微信扫码登陆
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
