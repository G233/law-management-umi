const pkg = require('./package.json');

exports.groupName = '项目开发环境'; // 可选，设置分组， 要求 Whistle 版本 >= v2.9.21
exports.name = `[${pkg.name}]本地环境配置`;
exports.rules = `
  # 所有发送到 law.liuxiaogu.com 的请求都转发到本地启动的服务器
  law.liuxiaogu.com localhost:8000
`;