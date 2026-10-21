import { Case, fetchLawList, fetchCaseCauseList } from '@/services/cases';
import { useEffect } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { ProFormSelect } from '@ant-design/pro-form';
import { Form, AutoComplete } from 'antd';
import useSafeState from '@/hook/useSafeState/index';

interface OptionType {
  value: string;
  label?: string;
}

export const useCommonColumns = (): ProColumns<Case>[] => {
  const [caseCauseList, setCaseCauseList] = useSafeState<OptionType[]>();

  useEffect(() => {
    const initAutoData = async () => {
      setCaseCauseList(await fetchCaseCauseList());
    };
    initAutoData();
  }, [setCaseCauseList]);

  return [
    {
      title: '案由 (涉案罪名)',
      width: 80,
      dataIndex: 'caseCause',
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
      title: '委托当事人 (嫌疑人)',
      width: 80,
      dataIndex: 'litigant',
      align: 'center',
    },
    {
      title: '对方当事人姓名 (名称)',
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
