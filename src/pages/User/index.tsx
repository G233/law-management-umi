import { useModel } from 'umi';
import ProForm, {
  ProFormText,
  ProFormDatePicker,
  ProFormSelect,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { reSetUserInfo, UserInfo, sexText } from '@/services/user';

// 自定义用户模型
export default function IndexPage() {
  const { initialState, refresh } = useModel('@@initialState');
  const userInfo = initialState?.currentUser;
  console.log('用户信息');
  console.log(userInfo);

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
              values as UserInfo,
              userInfo?.unionId as string,
              refresh,
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
            <ProFormSelect
              name="sex"
              label="性别"
              initialValue={userInfo?.sex}
              valueEnum={sexText}
              placeholder="请选择您的性别"
              rules={[{ required: true, message: '请选择您的性别' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              name="licenseNumber"
              label="执业证号"
              initialValue={userInfo?.licenseNumber}
              rules={[
                {
                  required: true,
                  message: '执业证号',
                },
              ]}
              tooltip="请输入执业证号"
              placeholder="请输入执业证号"
            />
            <ProFormDatePicker
              name="startDate"
              label="执业起始时间"
              initialValue={userInfo?.startDate}
              rules={[
                {
                  required: true,
                  message: '请设置执业起始时间',
                },
              ]}
            />
          </ProForm.Group>
          <ProFormText
            width="md"
            name="phone"
            label="手机号"
            initialValue={11111111}
            placeholder="请输入手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号',
              },
            ]}
          />
        </ProForm>
      </ProCard>
    </PageContainer>
  );
}
