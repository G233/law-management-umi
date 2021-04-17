import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import NoticeIconView from '@/components/NoticeIcon';
import Footer from '@/components/Footer';
import { fetchUserInfo, UserInfo } from '@/services/user';
import { Space, Button } from 'antd';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

export async function getInitialState() {
  let hasLogin = false;
  let currentUser: UserInfo | null;

  currentUser = await fetchUserInfo();
  if (currentUser) {
    hasLogin = true;
  }

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
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.hasLogin && location.pathname !== '/login') {
        history.push('/login');
      }
    },
    // ...initialState,
  };
};
