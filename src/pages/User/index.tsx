import { useModel } from 'umi';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { reSetUserInfo, userInfoProp } from '@/services/user';

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
              userInfo?.unionId as string,
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
    </PageContainer>
  );
}
