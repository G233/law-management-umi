import { useEffect } from 'react';
import { useAccess } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-layout';
import { EditableProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import useSafeState from '@/hook/useSafeState/index';

import { fetchAllUser, updateUserInfo, sexText } from '@/services/user';

export default function advisoryList() {
  const roleText = {
    admin: '管理律师',
    user: '执业律师',
  };

  const [editableKeys, setEditableRowKeys] = useSafeState<React.Key[]>([]);
  const [userColumns, setUserColumns] = useSafeState<ProColumns[]>([
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      valueEnum: sexText,
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      // width: 150,
      copyable: true,
    },

    {
      title: '执业证号',
      dataIndex: 'licenseNumber',
      copyable: true,
    },
    {
      title: '执业起始时间',
      dataIndex: 'startDate',
      valueType: 'date',
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
              修改信息
            </a>,
          ],
        },
      ]);
  }, [access.admin]);

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
          deletePopconfirmMessage: '这个删除按钮并不会实际删除，还未开发完成',
        }}
        rowKey={(e) => e._id ?? 'key'}
        search={false}
      />
    </PageContainer>
  );
}
