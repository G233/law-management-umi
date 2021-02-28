export default {
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/login',
      component: '@/pages/login/index',
      name: 'Welcome',
      layout: false,
      hideInMenu: true,
      icon: 'YuqueOutlined',
    },
    {
      path: '/',
      component: '@/pages/Welcome/index',
      name: 'Home',
      icon: 'AlertOutlined',
    },
  ],

  layout: {
    name: '河清律师事务所',
    layout: 'side',
  },
  fastRefresh: {},
};
