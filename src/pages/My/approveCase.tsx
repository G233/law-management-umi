import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import { Tag } from 'antd';
import {
  Case,
  fetchMyCases,
  requestProp,
  CaseStatusColor,
  CaseStatusText,
} from '@/services/cases';
import type { ProColumns } from '@ant-design/pro-table';

import { commonColumns } from '@/pages/CaseApprove/tableColumns';

export default function myCases() {
  const { initialState } = useModel('@@initialState');
  const openId = initialState?.currentUser?.uid;
  const myCasesColumns: ProColumns<Case>[] = [
    ...commonColumns(),
    {
      title: '审批状态',
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
      columns={myCasesColumns}
      request={(data: requestProp) =>
        fetchMyCases({ ...data, openId, tag: 'all' })
      }
      scroll={{ x: 1300 }}
      search={false}
      rowKey={(e) => e._id ?? 'key'}
      headerTitle="待审批案件"
      toolBarRender={() => []}
    />
  );
}
