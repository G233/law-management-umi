import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';

import { Cases, fetchApprovedCases } from '@/services/cases';

export default function approvedCases() {
  const approvedColumns: ProColumns<Cases>[] = [
    {
      title: '案件名称',
      width: 90,
      dataIndex: 'title', // 列数据在数据项中对应的路径，支持通过数组查询嵌套路径，设置了这个值就无需 key
      fixed: 'left',
    },
    {
      title: '涉案金额',
      width: 120,
      dataIndex: 'amount',
      align: 'center',
      search: false,
      valueType: 'money',
      // TODO: 排序 sorter: (a, b) => a.containers - b.containers,
    },
    {
      title: '收费',
      width: 120,
      align: 'center',
      dataIndex: 'toll',
      valueType: 'money',
    },
    {
      title: '当事人',
      dataIndex: 'litigant',
      width: 120,
      align: 'center',
    },
    {
      title: '被告人',
      dataIndex: 'Defendant',
      width: 80,
      align: 'center',
    },

    {
      title: '创建时间',
      width: 140,
      dataIndex: 'createTime',
      align: 'center',
      valueType: 'date',
    },
    {
      title: '案件描述',
      dataIndex: 'description',
      ellipsis: true,
      align: 'center',
      width: 160,
    },
    {
      title: '审批结果',
      dataIndex: 'status',
      align: 'center',
      width: 160,
      renderText: (e) => (e === 0 ? '同意' : '不同意'),
    },
    {
      title: '审批意见',
      dataIndex: 'approveMsg',
      ellipsis: true,
      align: 'center',
      width: 160,
    },
    {
      title: '审批人',
      dataIndex: 'approverName',
      align: 'center',
      width: 160,
    },
    {
      title: '审批时间',
      dataIndex: 'approveTime',
      align: 'center',
      width: 160,
      valueType: 'date',
    },
  ];

  return (
    <ProTable<Cases>
      columns={approvedColumns}
      request={fetchApprovedCases}
      scroll={{ x: 1300 }}
      options={false}
      search={false}
      rowKey={(e) => e._id ?? 'key'}
      headerTitle="待审批案件"
      toolBarRender={() => []}
    />
  );
}
