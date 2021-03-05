import { Button, message, Space } from 'antd';
import { useModel } from 'umi';
import { auth, db } from '@/cloud_function/index';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import styles from './index.less';

// 自定义用户模型

export default function IndexPage() {
  const { Divider } = ProCard;
  const { initialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser;
  const email = userInfo?.email;
  const collection = db.collection('User');

  interface emailProp {
    newEmail: string;
  }

  interface userInfoProp {
    name: string;
    phone: string;
  }
  // TODO: 逻辑操作统一放到 server 层
  // 更新用户个人信息
  // TODO：可以考虑做一个中间曾=层，统一添加操作反馈
  const setUserInfo = async (data: userInfoProp) => {
    console.log('111');

    const User = await collection
      .where({
        _openid: userInfo?.uid,
      })
      .get();

    // 如果用户已经设置过个人信息了，则更新信息
    if (User.data[0]) {
      const docId: string = User.data[0]._id;
      await collection.doc(docId).update(data);
    } else {
      await collection.add(data);
    }

    // collection.doc(User.)
    // const res = await collection.add(data);
    message.success('更新个人信息成功！');
  };
  // 重置密码
  const handleChangePassword = async () => {
    return auth.sendPasswordResetEmail(userInfo?.email as string).then(() => {
      message.success('重置密码邮件发送成功，请注意查收');
    });
  };

  // 重置邮箱
  const handleChangeEmail = async ({ newEmail }: emailProp) => {
    console.log(newEmail, email);
    if (newEmail === email) {
      message.warning('请输入新邮箱进行修改');
      return;
    }
    return auth.currentUser
      ?.updateEmail(newEmail)
      .then(() => {
        message.success('确认邮件已发送到新邮箱，请注意查收');
      })
      .catch((err) => {
        message.error('更改邮箱失败，请稍后再试');
      });
  };

  return (
    <PageContainer>
      <ProCard title="个人资料" headerBordered>
        <ProForm
          submitter={{
            searchConfig: {
              submitText: '更新个人信息',
            },
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              size: 'large',
              style: {
                width: '10rem',
              },
            },
          }}
          onFinish={async (values) => {
            await setUserInfo(values as userInfoProp);
          }}
        >
          <ProForm.Group>
            <ProFormText
              name="name"
              label="姓名"
              initialValue={userInfo?.name}
              rules={[
                {
                  required: true,
                  message: '请输入姓名',
                },
              ]}
              tooltip="请输入真实姓名，用于展示"
              placeholder="请输入姓名"
            />
            {/* TODO: 添加手机号类型校验 */}
            <ProFormText
              width="md"
              name="phone"
              label="手机号"
              initialValue={userInfo?.phone}
              placeholder="请输入手机号"
              rules={[
                {
                  required: true,
                  message: '请输入手机号',
                },
              ]}
            />
          </ProForm.Group>
        </ProForm>
      </ProCard>
      <Divider />
      <ProCard title="账户设置" headerBordered>
        <ProForm
          submitter={{
            searchConfig: {
              submitText: '更新绑定邮箱',
            },
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              size: 'large',
              style: {
                width: '10rem',
              },
            },
          }}
          onFinish={async (values) => {
            await handleChangeEmail(values as emailProp);
          }}
        >
          <ProForm.Group>
            <ProFormText
              initialValue={email}
              width="md"
              name="newEmail"
              label="绑定邮箱"
              rules={[
                {
                  required: true,
                  message: '请输入邮箱!',
                },
                {
                  type: 'email',
                  message: '请输入正确格式的邮箱',
                },
              ]}
              placeholder="请输入邮箱号"
            />
          </ProForm.Group>
        </ProForm>
        <Space>
          <Button
            danger
            className={styles.pwBtn}
            type="primary"
            size="large"
            onClick={handleChangePassword}
          >
            重置密码
          </Button>
        </Space>
      </ProCard>
    </PageContainer>
  );
}
