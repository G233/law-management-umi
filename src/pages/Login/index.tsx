import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { trim } from 'lodash';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Link, history, useModel } from 'umi';
import Footer from '@/components/Footer';

import styles from './index.less';
import { signIn, fetchUserInfo } from '@/services/user';

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
    email?: string;
    password?: string;
    autoLogin?: boolean;
  }
  const [submitting, setSubmitting] = useState(false);
  const [loginStatus, setLoginStatus] = useState(LoginStatus.LODING);
  const { initialState, setInitialState, refresh } = useModel('@@initialState');

  // 用户登陆函数
  const handleSubmit = async (values: LoginParams) => {
    setSubmitting(true);

    const userInfo = await signIn(
      trim(values.email as string),
      trim(values.password as string),
    ).catch((err) => {
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
    }
    setSubmitting(false);
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
              <LoginMessage content="邮箱或密码错误" />
            )}

            <ProFormText
              name="email"
              fieldProps={{
                size: 'large',
                prefix: <MailOutlined className={styles.prefixIcon} />,
              }}
              placeholder="请输入注册邮箱"
              initialValue="liuxgu@qq.com"
              rules={[
                {
                  required: true,
                  message: '请输入邮箱!',
                },
                {
                  type: 'email',
                  message: '请输入正确格式的邮箱',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              initialValue="123456789liugu"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder="默认密码：heqing123456"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
          </ProForm>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
