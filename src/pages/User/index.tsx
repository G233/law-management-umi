import { Button, Space } from 'antd';
import { useModel } from 'umi';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import {
  resetEmail,
  resetPassword,
  reSetUserInfo,
  userInfoProp,
} from '@/services/user';
import styles from './index.less';

// 自定义用户模型

export default function IndexPage() {
  const { Divider } = ProCard;
  const { initialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser;
  const email = userInfo?.email;

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
            await reSetUserInfo(
              values as userInfoProp,
              userInfo?.uid as string,
            );
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
            await resetEmail(values.newEmail, email as string);
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
            onClick={() => {
              resetPassword(userInfo?.email as string);
            }}
          >
            重置密码
          </Button>
        </Space>
      </ProCard>
    </PageContainer>
  );
}
