const wxCloudbase = require('wx-server-sdk');
// import * as wxCloudbase from 'wx-server-sdk';

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 *
 * event 参数包含小程序端调用传入的 data
 *
 */
const isDev = process.env.NODE_ENV === 'development';

const wxLogin = () => {
  wxCloudbase.init({
    env: isDev ? 'atom-2gbnzw0gde4242dc' : 'atom-build-3gucmakw82f1fc3c',
  });
  const wxContext = wxCloudbase.getWXContext();

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    env: wxContext.ENV,
  };
};
export { wxLogin };
