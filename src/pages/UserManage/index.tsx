import ProTable from '@ant-design/pro-table';
import { Button, Alert, Space } from 'antd';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';

import { UserInfo, fetchAllUser, addUser } from '@/services/user';

export default function advisoryList() {
  const roleText = {
    admin: '管理律师',
    user: '普通律师',
  };
  const userColumns: ProColumns[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
    },
    {
      title: '权限',
      dataIndex: 'role',
      valueEnum: roleText,
    },
  ];
  const createBtn = (fn: ActionType | undefined) => (
    <ModalForm<UserInfo>
      title="添加人员"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          添加人员
        </Button>
      }
      onFinish={async (values) => {
        await addUser(values);
        // @ts-ignore
        fn.reloadAndRest();

        return true;
      }}
    >
      <ProFormText
        name="email"
        label="登陆邮箱"
        tooltip="此邮箱将用于登陆管理系统"
        placeholder="请输入邮箱"
        width="sm"
        rules={[
          {
            required: true,
            message: '请输入登陆邮箱',
          },
        ]}
      />
      {/* <ProFormSelect
        name="role"
        width="sm"
        label="律师权限"
        tooltip="只有管理律师拥有「审批案件」「查看所有人员信息」等权限"
        initialValue="user"
        valueEnum={roleText}
        placeholder="请选择律师角色"
        rules={[{ required: true, message: '请选择律师角色!' }]}
      /> */}
      <Space direction="vertical" size="large">
        <Alert
          message="默认登陆密码「 heqing123456 」请尽快修改密码"
          closable
          type="info"
        />
      </Space>
    </ModalForm>
  );
  return (
    <ProTable
      columns={userColumns}
      request={fetchAllUser}
      scroll={{ x: 1300 }}
      rowKey={(e) => e._id ?? 'key'}
      search={false}
      toolBarRender={(data) => [createBtn(data)]}
    />
  );
}
