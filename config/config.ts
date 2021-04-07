export default {
  nodeModulesTransform: {
    type: 'none',
  },
  esbuild: {},
  // 生产环境下生成静态化站点
  exportStatic: {},
  // 图标可以查阅：https://ant.design/components/icon-cn/
  routes: [
    { exact: true, path: '/', redirect: '/CaseList' },
    {
      path: '/CaseList',
      component: '@/pages/CaseList/index',
      name: '所有案件',
      icon: 'SnippetsOutlined',
    },
    {
      path: '/AllAdvisory',
      component: '@/pages/Advisory/all',
      name: '法律顾问单位',
      icon: 'CommentOutlined',
    },
    {
      path: '/CaseApprove',
      component: '@/pages/CaseApprove/index',
      name: '案件审批',
      icon: 'BellOutlined',
    },

    {
      path: '/My',
      component: '@/pages/My/index',
      name: '我的',
      icon: 'TeamOutlined',
    },

    {
      path: '/user',
      component: '@/pages/User/index',
      name: '个人信息',
      icon: 'UserOutlined',
    },
    {
      path: '/CaseDetail',
      component: '@/pages/CaseDetail/index',
      name: '案件详情',
      hideInMenu: true,
      icon: 'SnippetsOutlined',
    },
    {
      path: '/login',
      component: '@/pages/Login/index',
      name: 'Welcome',
      layout: false,
      hideInMenu: true,
    },
    { component: '@/pages/404' },
  ],

  layout: {
    name: '河清律师事务所',
    layout: 'side',
  },
  fastRefresh: {},
};
