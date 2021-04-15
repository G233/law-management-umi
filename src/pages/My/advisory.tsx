import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { requestProp } from '@/services/cases';

import {
  ModalForm,
  ProFormText,
  ProFormDateRangePicker,
  ProFormDigit,
} from '@ant-design/pro-form';

import { useModel } from 'umi';
import { PlusOutlined } from '@ant-design/icons';

import type { ProColumns, ActionType } from '@ant-design/pro-table';

import {
  newAdvisory,
  featchMyAdvisory,
  AdvisoryType,
} from '@/services/advisory';

export default function advisoryList() {
  const { initialState } = useModel('@@initialState');
  const openId = initialState?.currentUser?.uid;
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
  ];
  const createBtn = (fn: ActionType | undefined) => (
    <ModalForm<AdvisoryType>
      title="添加法律顾问单位"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          添加法律顾问单位
        </Button>
      }
      onFinish={async (values) => {
        await newAdvisory(values as AdvisoryType);
        // @ts-ignore
        fn.reloadAndRest();

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
      request={(data: requestProp) => featchMyAdvisory({ ...data, openId })}
      scroll={{ x: 1300 }}
      rowKey={(e) => e._id ?? 'key'}
      search={false}
      toolBarRender={(data) => [createBtn(data)]}
    />
  );
}
