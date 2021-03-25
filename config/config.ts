export default {
  nodeModulesTransform: {
    type: 'none',
  },
  // 使用 esbuild 进行构建
  esbuild: {},
  // 生产环境下生成静态话站点
  exportStatic: {},
  // 图标可以查阅：https://ant.design/components/icon-cn/
  routes: [
    { exact: true, path: '/', redirect: '/Cases' },
    {
      path: '/Cases',
      component: '@/pages/Cases/index',
      name: '案件列表',
      icon: 'SnippetsOutlined',
    },
    {
      path: '/CreateCases',
      component: '@/pages/CreateCases/index',
      name: '新建审批',
      icon: 'SnippetsOutlined',
    },
    {
      path: '/user',
      component: '@/pages/User/index',
      name: '个人中心',
      icon: 'UserOutlined',
    },
    {
      path: '/login',
      component: '@/pages/Login/index',
      name: 'Welcome',
      layout: false,
      hideInMenu: true,
    },
  ],

  layout: {
    name: '河清律师事务所',
    layout: 'side',
  },
  fastRefresh: {},
};
