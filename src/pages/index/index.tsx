import cloudApp from '../../cloud_function/index';
import { useModel } from 'umi';

export default function IndexPage() {
  const auth = cloudApp.auth({
    persistence: 'local',
  });

  //   async function login() {
  //     await auth.anonymousAuthProvider().signIn();
  //     // 匿名登录成功检测登录状态isAnonymous字段为true
  //     const loginState = await auth.getLoginState();
  //     console.log(loginState?.isAnonymousAuth); // true
  //   }

  //   async function login() {
  //     // 1. 建议登录前先判断当前是否已经登录
  //     const loginState = await auth.getLoginState();
  //     console.log(loginState);
  //     if (!loginState) {
  //       // 2. 调用微信登录API
  //       try {
  //         const a = await auth
  //           .weixinAuthProvider({
  //             appid: 'wxbb01f719d367e508', // 微信开放平台的appid
  //             scope: 'snsapi_login',
  //           })
  //           .signInWithRedirect();
  //         console.log(a);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   }

  //   login();

  //   auth
  //     .signUpWithEmailAndPassword('214546439@qq.com', 'liu23358632')
  //     .then(() => {
  //       // 发送验证邮件成功
  //     });

  //   cloudApp
  //     .callFunction({
  //       // 云函数名称
  //       name: 'hello_world',
  //       // 传给云函数的参数
  //       data: {
  //         a: 1,
  //       },
  //     })
  //     .then((res: any) => {
  //       console.log(res);
  //     })
  //     .catch((e: any) => {
  //       console.error('出错1！');
  //     });

  return (
    <div>
      <h1>P312321啊啊啊啊啊3</h1>
    </div>
  );
}
