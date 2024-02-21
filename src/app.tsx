import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import NoticeIconView from '@/components/NoticeIcon';
import Footer from '@/components/Footer';
import { fetchUserInfo, UserInfo } from '@/services/user';
import { Space, Button, message } from 'antd';
import { provider } from '@/cloud_function';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

export async function getInitialState() {
  // TODO 暂时允许扫码之后直接注册，需要在后期取消
  await provider.getRedirectResult({
    createUser: true,
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
    footerRender: () => <Footer />,
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
          <NoticeIconView /> <RightContent />
        </Space>
      </div>
    ),

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
