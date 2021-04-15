import { useModel } from 'umi';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { ProFormSelect } from '@ant-design/pro-form';
import { featchAllAdvisory, AdvisoryType } from '@/services/advisory';
import { fetchLawList } from '@/services/cases';
import type { ProColumns } from '@ant-design/pro-table';

export default function advisoryList() {
  const advisoryColumns: ProColumns<AdvisoryType>[] = [
    {
      title: '法律顾问单位名称',
      width: 50,
      dataIndex: 'name',
      formItemProps: {
        label: '单位名称',
      },
    },
    {
      title: '聘任期限',
      width: 50,
      dataIndex: 'timeRange',
      valueType: 'dateRange',
      hideInSearch: true,
    },
    {
      title: '顾问律师',
      width: 50,
      dataIndex: 'userName',
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
  ];
  return (
    <div>
      <PageContainer>
        <ProTable<AdvisoryType>
          columns={advisoryColumns}
          request={featchAllAdvisory}
          scroll={{ x: 1300 }}
          search={{ labelWidth: 'auto' }}
          rowKey={(e) => e._id ?? 'key'}
        />
      </PageContainer>
    </div>
  );
}
