export default {
  nodeModulesTransform: {
    type: 'none',
  },
  esbuild: {},
  // 图标可以查阅：https://ant.design/components/icon-cn/
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
    {
      path: '/user',
      component: '@/pages/User/index',
      name: '个人中心',
      icon: 'UserOutlined',
    },
  ],

  layout: {
    name: '河清律师事务所',
    layout: 'side',
  },
  fastRefresh: {},
};
