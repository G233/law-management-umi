import styles from './index.less';
import cloudApp from '../../cloud_function/index';
import { useModel } from 'umi';

export default function IndexPage() {
  const auth = cloudApp.auth({
    persistence: 'local',
  });

  async function login() {
    await auth.anonymousAuthProvider().signIn();
    // 匿名登录成功检测登录状态isAnonymous字段为true
    const loginState = await auth.getLoginState();
    console.log(loginState?.isAnonymousAuth); // true
  }

  login();

  cloudApp
    .callFunction({
      // 云函数名称
      name: 'hello_world',
      // 传给云函数的参数
      data: {
        a: 1,
      },
    })
    .then((res: any) => {
      console.log(res);
    })
    .catch((e: any) => {
      console.error('出错1！');
    });

  return (
    <div>
      <h1 className={styles.title}>P</h1>
    </div>
  );
}
