import cloudbase from '@cloudbase/js-sdk';
import { getMockCloudApp, isMockMode } from '@/mocks/cloudbase-mock';

const isDev = process.env.NODE_ENV === 'development';

let cloudApp: any;
let auth: any;
let db: any;
let provider: any;

if (isMockMode()) {
  cloudApp = getMockCloudApp();
  auth = cloudApp.auth({ persistence: 'local' });
  db = cloudApp.database();
  provider = cloudApp;
} else {
  // 使用 CloudBase SDK 2.x 初始化
  cloudApp = cloudbase.init({
    env: isDev ? 'atom-2gbnzw0gde4242dc' : 'atom-build-3gucmakw82f1fc3c',
  });
  auth = cloudApp.auth({ persistence: 'local' });
  db = cloudApp.database();
  provider = auth.weixinAuthProvider({
    appid: 'wx6df6a071b2944a44',
    scope: 'snsapi_login',
  });
}

export { cloudApp, auth, db, provider };
