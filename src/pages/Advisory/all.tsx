import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';

import { featchAllAdvisory, AdvisoryType } from '@/services/advisory';

export default function advisoryList() {
  const advisoryColumns: ProColumns<AdvisoryType>[] = [
    {
      title: '法律顾问单位名称',
      width: 50,
      dataIndex: 'name',
    },
    {
      title: '聘任期限',
      width: 50,
      dataIndex: 'timeRange',
      valueType: 'dateRange',
    },
    {
      title: '顾问律师',
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
