import { useState, useEffect } from 'react';
import { Button, Alert, Space } from 'antd';
import { useAccess } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';

import {
  UserInfo,
  fetchAllUser,
  addUser,
  updateUserInfo,
} from '@/services/user';

export default function advisoryList() {
  const roleText = {
    admin: '管理律师',
    user: '执业律师',
  };
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [userColumns, setUserColumns] = useState<ProColumns[]>([
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      copyable: true,
    },
    {
      title: '权限',
      dataIndex: 'role',
      valueEnum: roleText,
      editable: (text, record, index) => {
        return record.role !== 'admin';
      },
    },
  ]);

  const access = useAccess();

  useEffect(() => {
    access.admin &&
      setUserColumns([
        ...userColumns,
        {
          title: '修改权限',
          valueType: 'option',
          render: (text, record, _, action) => [
            <a
              key="editable"
              onClick={() => {
                action.startEditable?.(record._id);
              }}
            >
              编辑
            </a>,
          ],
        },
      ]);
  }, [access.admin]);

  const createBtn = (fn: ActionType | undefined) =>
    access.admin ? (
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
        <Space direction="vertical" size="large">
          <Alert
            message="默认登陆密码「 heqing123456 」请尽快修改密码"
            closable
            type="info"
          />
        </Space>
      </ModalForm>
    ) : null;

  return (
    <PageContainer>
      <EditableProTable
        columns={userColumns}
        request={fetchAllUser}
        recordCreatorProps={false}
        editable={{
          type: 'single',
          editableKeys,
          onSave: updateUserInfo,
          onChange: setEditableRowKeys,
        }}
        scroll={{ x: 1300 }}
        rowKey={(e) => e._id ?? 'key'}
        search={false}
        toolBarRender={(data) => [createBtn(data)]}
      />
    </PageContainer>
  );
}
