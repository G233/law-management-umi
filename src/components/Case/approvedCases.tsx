import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { Tag } from 'antd';
import { commonColumns } from '@/components/Case/tableColumns';
import {
  Case,
  fetchApprovedCases,
  CaseStatusColor,
  CaseStatusText,
} from '@/services/cases';

export default function approvedCases() {
  const approvedColumns: ProColumns<Case>[] = [
    ...commonColumns(),
    {
      title: '审批结果',
      dataIndex: 'approveStatus',
      align: 'center',
      width: 160,
      render: (_, record) => (
        <Tag color={CaseStatusColor[record.approveStatus]}>
          {CaseStatusText[record.approveStatus]}
        </Tag>
      ),
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
    <ProTable<Case>
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
