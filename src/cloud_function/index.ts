import cloudbase from '@cloudbase/js-sdk';

const cloudApp = cloudbase.init({
  env: 'atom-2gbnzw0gde4242dc',
});

const auth = cloudApp.auth({ persistence: 'local' });

export { cloudApp, auth };
