import { Case, fetchLawList, fetchCaseCauseList } from '@/services/cases';
import { useState, useEffect } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { ProFormSelect } from '@ant-design/pro-form';
import { Form, AutoComplete } from 'antd';

export const commonColumns = (): ProColumns<Case>[] => {
  interface optionType {
    value: string;
    label?: string;
  }
  const [caseCauseList, setCaseCauseList] = useState<optionType[]>();

  const initAutoData = async () => {
    setCaseCauseList(await fetchCaseCauseList());
  };

  useEffect(() => {
    initAutoData();
  }, []);

  return [
    {
      title: '案由',
      width: 80,
      dataIndex: 'caseCause', // 列数据在数据项中对应的路径，支持通过数组查询嵌套路径，设置了这个值就无需 key
      renderFormItem: () => (
        <Form.Item name="caseCause" label="">
          <AutoComplete
            options={caseCauseList}
            style={{ width: 200 }}
            filterOption
          />
        </Form.Item>
      ),
    },
    {
      title: '委托当事人姓名(名称)',
      width: 80,
      dataIndex: 'litigant',
      align: 'center',
    },
    {
      title: '对方当事人姓名(名称)',
      width: 80,
      dataIndex: 'otherlitigant',
      align: 'center',
    },
    {
      title: '承办律师',
      width: 60,
      align: 'center',
      dataIndex: 'undertakerName',
      renderFormItem: () => (
        <ProFormSelect
          name="undertaker"
          label=""
          width="sm"
          request={fetchLawList}
          placeholder="选择承办律师"
          showSearch={true}
        />
      ),
    },
    {
      title: '立案时间',
      width: 100,
      dataIndex: 'createTime',
      align: 'center',
      valueType: 'date',
      search: false,
      hideInSearch: true,
    },
    {
      title: '案号',
      dataIndex: 'caseId',
      ellipsis: true,
      align: 'center',

      width: 130,
    },
  ];
};
