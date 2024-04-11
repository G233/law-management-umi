import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import RightContent from '@/components/RightContent';
import NoticeIconView from '@/components/NoticeIcon';
import Footer from '@/components/Footer';
import { fetchUserInfo, UserInfo } from '@/services/user';
import { Space, Button, message } from 'antd';
import { provider } from '@/cloud_function';

export async function getInitialState() {
  await provider.getRedirectResult({
    // 不自动创建用户
    createUser: false,
    syncUserInfo: true,
  });

  let hasLogin = false;
  let currentUser: UserInfo | null;
  currentUser = await fetchUserInfo();
  if (currentUser) {
    hasLogin = true;
  }
  const isDev = process.env.NODE_ENV === 'development';
  console.log(isDev ? '当前处于开发环境' : '当前处于生产环境');
  return {
    hasLogin,
    currentUser,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    title: '湖南河清律师事务所',
    footerRender: () => <Footer />,
    layout: 'mix',
    rightContentRender: () => (
      <div>
        <Space>
          <Button
            type="link"
            onClick={() =>
              window.open(
                'https://docs.qq.com/form/page/DSmZ1SUtmVWl1aUh3?_w_tencentdocx_form=1',
              )
            }
          >
            问题反馈
          </Button>
          <NoticeIconView />
          <RightContent />
        </Space>
      </div>
    ),
    // headerRender: false,

    onPageChange: () => {
      if (!initialState?.hasLogin) {
        // 如果没有登录，重定向到微信扫码页进行登陆
        provider.signInWithRedirect();
        return;
      }
      // 没有填写信息强制跳转填写
      if (
        !initialState?.currentUser?.hasAddInfo &&
        history.location.pathname !== '/setting'
      ) {
        history.push('/setting');
        message.warning('请完整填写个人信息后再开始使用本系统');
      }
    },
  };
};
