import { defineConfig } from '@umijs/max';
export default defineConfig({
  hash: true,
  model: {},
  antd: {},
  deadCode:{},
  layout: {
    locale: false, // 默认开启，如无需菜单国际化可关闭
  },
  request: {},
  access: {},
  mfsu: false,
  // access 插件依赖 initial State 所以需要同时开启
  initialState: {},
  // 生产环境下生成静态化站点
  exportStatic: {},
  // 图标可以查阅：https://ant.design/components/icon-cn/
  routes: [
    { exact: true, path: '/', redirect: '/CaseList' },
    {
      path: '/CaseList',
      component: '@/pages/CaseList/index',
      name: '律所案件信息',
      icon: 'SnippetsOutlined',
    },
    {
      path: '/AllAdvisory',
      component: '@/pages/Advisory/all',
      name: '律所法律顾问单位信息',
      icon: 'CommentOutlined',
    },
    {
      path: '/CaseApprove',
      component: '@/pages/CaseApprove/index',
      name: '案件审批',
      icon: 'BellOutlined',
      access: 'admin',
    },
    {
      path: '/addCaseApprove',
      component: '@/pages/addCaseApprove/index',
      name: '案件报批',
      icon: 'UserSwitchOutlined',
    },
    {
      path: '/UserManage',
      component: '@/pages/UserManage/index',
      name: '律师信息',
      icon: 'UserSwitchOutlined',
    },
    {
      path: '/My',
      component: '@/pages/My/index',
      name: '我的',
      icon: 'UserOutlined',
      defaultCollapsed: true,
      routes: [
        {
          path: '/My/caseList',
          component: '@/pages/My/caseList',
          name: '案件',
          icon: 'UserOutlined',
        },
        {
          path: '/My/advisory',
          component: '@/pages/My/advisory',
          name: '法律顾问单位',
          icon: 'UserOutlined',
        },
      ],
    },
    {
      path: '/setting',
      component: '@/pages/User/index',
      name: '个人设置',
      icon: 'SettingOutlined',
    },
    {
      path: '/CaseDetail',
      component: '@/pages/CaseDetail/index',
      name: '案件详情',
      hideInMenu: true,
      icon: 'SnippetsOutlined',
    },
    { path: '/*', component: '@/pages/404' },
  ],
  fastRefresh: true,
  npmClient: 'pnpm',
}
)