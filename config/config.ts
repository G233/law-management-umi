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
      component: '@/pages/index/index',
      name: '首页',
      icon: 'AlertOutlined',
    },
    {
      path: '/about',
      component: '@/pages/About/index',
      name: '关于',
      icon: 'AlertOutlined',
    },
    {
      path: '/welcome',
      component: '@/pages/Welcome/index',
      name: '欢迎',
      icon: 'AlertOutlined',
    },
  ],

  layout: {
    name: '河清律师事务所',
    layout: 'side',
  },
  fastRefresh: {},
};
