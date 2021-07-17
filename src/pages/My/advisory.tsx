import { useModel } from 'umi';
import { useRef } from 'react';
import { Button } from 'antd';
import type { FormInstance } from 'antd';
import ProTable from '@ant-design/pro-table';
import {
  ModalForm,
  ProFormText,
  ProFormDateRangePicker,
} from '@ant-design/pro-form';
import type { ProColumns, ActionType } from '@ant-design/pro-table';

import {
  newAdvisory,
  featchMyAdvisory,
  AdvisoryType,
  updateAdvisory,
  deleteAdvisory,
} from '@/services/advisory';
import { requestProp } from '@/services/cases';
import useSafeState from '@/hook/useSafeState/index';

export default function advisoryList() {
  const { initialState } = useModel('@@initialState');
  const unionId = initialState?.currentUser?.unionId;
  const [editableKeys, setEditableRowKeys] = useSafeState<React.Key[]>([]);

  const advisoryColumns: ProColumns<AdvisoryType>[] = [
    {
      title: '法律顾问单位名称',
      dataIndex: 'name',
    },
    {
      title: '聘任期限',
      dataIndex: 'timeRange',
      valueType: 'dateRange',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record._id);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];
  const formRef = useRef<FormInstance>();
  const createBtn = (fn: ActionType | undefined) => (
    <ModalForm<AdvisoryType>
      title="添加法律顾问单位"
      trigger={<Button type="primary">添加法律顾问单位</Button>}
      formRef={formRef}
      onFinish={async (values) => {
        await newAdvisory(values as AdvisoryType, unionId as string);
        // @ts-ignore
        fn.reloadAndRest();
        formRef.current?.resetFields();
        return true;
      }}
    >
      <ProFormText
        name="name"
        label="法律顾问单位名称"
        rules={[
          {
            required: true,
            message: '请输入法律顾问单位名称',
          },
        ]}
      />
      <ProFormDateRangePicker
        name="timeRange"
        label="聘任期限"
        rules={[
          {
            required: true,
            message: '请输入聘任期限',
          },
        ]}
      />
    </ModalForm>
  );
  return (
    <ProTable<AdvisoryType>
      columns={advisoryColumns}
      request={(data: requestProp) => featchMyAdvisory({ ...data, unionId })}
      rowKey={(e) => e._id ?? 'key'}
      search={false}
      editable={{
        type: 'single',
        editableKeys,
        onSave: updateAdvisory,
        onChange: setEditableRowKeys,
        onDelete: deleteAdvisory,
        deletePopconfirmMessage: '确认删除这个法律顾问单位信息吗',
      }}
      toolBarRender={(data) => [createBtn(data)]}
    />
  );
}
