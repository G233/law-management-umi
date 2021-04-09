import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';

import { featchAllAdvisory, AdvisoryType } from '@/services/advisory';

export default function advisoryList() {
  const advisoryColumns: ProColumns<AdvisoryType>[] = [
    {
      title: '公司名称',
      width: 50,
      dataIndex: 'name',
    },
    {
      title: '签约时间',
      width: 50,
      dataIndex: 'timeRange',
      valueType: 'dateRange',
    },
    {
      title: '签约金额',
      width: 50,
      dataIndex: 'price',
      valueType: 'money',
    },
    {
      title: '律师',
      width: 50,
      dataIndex: 'userName',
    },
  ];
  return (
    <div>
      <PageContainer>
        <ProTable<AdvisoryType>
          columns={advisoryColumns}
          request={featchAllAdvisory}
          scroll={{ x: 1300 }}
          rowKey={(e) => e._id ?? 'key'}
          search={false}
        />
      </PageContainer>
    </div>
  );
}
