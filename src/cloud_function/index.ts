import cloudbase from '@cloudbase/js-sdk';

const isDev = process.env.NODE_ENV === 'development';
const cloudApp = cloudbase.init({
  env: isDev ? 'atom-2gbnzw0gde4242dc' : 'law-build-8gty78990cd939d6',
});
const auth = cloudApp.auth({ persistence: 'local' });
const db = cloudApp.database();
const provider = auth.weixinAuthProvider({
  appid: 'wx6df6a071b2944a44',
  scope: 'snsapi_login',
});

export { cloudApp, auth, db, provider };
