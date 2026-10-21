/**
 * CloudBase wrapper that supports mock mode
 */
import cloudbase from '@cloudbase/js-sdk';
import { isMockMode, getMockCloudApp } from './mocks/cloudbase-mock';

let app: any;

if (isMockMode()) {
  console.log('[Mock Mode] Using mock CloudBase implementation');
  app = getMockCloudApp();
} else {
  app = cloudbase.init({
    env: 'atom-2gbnzw0gde4242dc',
  });
}

export const cloudApp = app;
export const db = app.database();
export const auth = app.auth({ persistence: 'local' });
export const _ = isMockMode() 
  ? (await import('./mocks/cloudbase-mock')).mockCommand
  : db.command;
