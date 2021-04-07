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
      path: '/CaseApprove',
      component: '@/pages/CaseApprove/index',
      name: '案件审批',
      icon: 'SnippetsOutlined',
    },

    {
      path: '/MyCases',
      component: '@/pages/MyCases/index',
      name: '我的案件',
      icon: 'SnippetsOutlined',
    },
    {
      path: '/CreateCases',
      component: '@/pages/CreateCases/index',
      name: '新建审批',
      icon: 'SnippetsOutlined',
    },
    {
      path: '/Advisory',
      component: '@/pages/Advisory/index',
      name: '我的法律顾问单位',
      icon: 'SnippetsOutlined',
    },

    {
      path: '/user',
      component: '@/pages/User/index',
      name: '个人中心',
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
