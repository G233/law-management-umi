import { Button, Space } from 'antd';
import { useModel } from 'umi';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import {
  reSetUserInfo,
  userInfoProp,
  updatePassword,
  updateUserName,
} from '@/services/user';
import styles from './index.less';

// 自定义用户模型

export default function IndexPage() {
  const { Divider } = ProCard;
  const { initialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser;

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
      {/* <ProCard title="登陆用户名" headerBordered>
        <ProForm
          submitter={{
            searchConfig: {
              submitText: '修改用户名',
            },
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              size: 'large',
            },
          }}
          onFinish={async (values) => {
            await updateUserName(values.userName);
          }}
        >
          <ProFormText
            width="md"
            name="userName"
            label="自定义登陆用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
            ]}
            placeholder="请输入用户名"
          />
        </ProForm>
      </ProCard>
      <Divider />
      <ProCard title="登陆密码" headerBordered>
        <ProForm
          submitter={{
            searchConfig: {
              submitText: '修改登陆密码',
            },
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              size: 'large',
            },
          }}
          onFinish={async (values) => {
            await updatePassword(values.oldPssword, values.newPassword);
          }}
        >
          <ProFormText
            width="md"
            name="oldPssword"
            label="旧登陆密码"
            placeholder="请输入旧密码，若未设置过则留空"
          />
          <ProFormText
            width="md"
            name="newPassword"
            label="新登陆密码"
            rules={[
              {
                required: true,
                message: '请输入新登陆密码',
              },
            ]}
            placeholder="请输入新登陆密码"
          />
        </ProForm>
      </ProCard> */}
    </PageContainer>
  );
}
