import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Alert, message, Button } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { Link, history, useModel } from 'umi';
import Footer from '@/components/Footer';

import styles from './index.less';
import { signIn } from '@/services/user';

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
  const [submitting, setSubmitting] = useState(false);
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(
    LoginStatus.LODING,
  );
  const { initialState, setInitialState, refresh } = useModel('@@initialState');
  // FIXME：是否保持登陆这一块流程还需要完善
  // 用户登陆函数
  const handleSubmit = async (values: API.LoginParams) => {
    setSubmitting(true);

    const userInfo = await signIn(
      values.email as string,
      values.password as string,
    ).catch((err) => {
      // 登陆失败的情况包括密码错误与其他报错,因为云开发密码错误也是直接报错
      message.error('登录失败，请重试！');
      setLoginStatus(LoginStatus.ERROR);
    });

    if (userInfo && initialState) {
      // FIXME： 需要优化
      // !!! 这两行看起来是重复的，但是删去任意一个会导致在 history.push('/') 之后，
      // onPageChange 函数拿不到新的 initialState，无法判断是否登陆，导致第一次无法进入管理页面
      setInitialState({ ...initialState, hasLogin: true });
      await refresh();

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
          <div className={styles.desc}>河清律师事务所管理系统</div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
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
              handleSubmit(values as API.LoginParams);
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
              placeholder="邮箱:"
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
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder="密码:"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />

            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                自动登录
              </ProFormCheckbox>
              <Button type="link">同意</Button>
            </div>
          </ProForm>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
