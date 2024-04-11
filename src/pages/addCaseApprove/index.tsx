import { useModel } from '@umijs/max';
import { Tag } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';

import {
  Case,
  fetchMyCases,
  requestProp,
  CaseStatusColor,
  CaseStatusText,
  CaseStatus,
} from '@/services/cases';
import { commonColumns } from '@/pages/CaseApprove/tableColumns';
import { formType, caseForm } from '@/pages/addCaseApprove/createCase';
import { useRef } from 'react';

export default function myCases() {
  const { initialState } = useModel('@@initialState');
  const unionId = initialState?.currentUser?.unionId;
  const tableRef = useRef<ActionType>();

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
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      render: (text, record) => {
        // 已经通过审批的不允许更改了
        if (record.approveStatus !== CaseStatus.AGREE) {
          return caseForm({
            type: formType.change,
            case: record,
            tableRef,
          });
        }
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<Case>
        actionRef={tableRef}
        columns={myCasesColumns}
        request={(data: requestProp) =>
          fetchMyCases({ ...data, unionId, tag: 'all' })
        }
        scroll={{ x: 1000 }}
        search={false}
        rowKey={(e) => e._id ?? 'key'}
        headerTitle="案件审批记录"
        toolBarRender={() => [caseForm({ type: formType.create, tableRef })]}
      />
    </PageContainer>
  );
}
