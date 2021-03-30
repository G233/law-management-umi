import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';

import type { ProColumns } from '@ant-design/pro-table';
import { commonColumns } from '@/components/Case/tableColumns';

import { Case, fetchCaseList, CaseType, CaseTypeText } from '@/services/cases';
import { useEffect } from 'react';

export default function CaseList() {
  const myCasesColumns: ProColumns<Case>[] = [
    ...commonColumns,
    {
      title: '案件类别',
      dataIndex: 'CaseType',
      filters: true,
      onFilter: true,
      width: 60,
      valueType: 'select',
      valueEnum: {
        [CaseType.Civil]: {
          text: CaseTypeText[CaseType.Civil],
        },
        [CaseType.Criminal]: {
          text: CaseTypeText[CaseType.Criminal],
        },
        [CaseType.Administrative]: {
          text: CaseTypeText[CaseType.Administrative],
        },
      },
    },
    {
      title: '案号',
      dataIndex: 'caseId',
      ellipsis: true,
      align: 'center',
      width: 130,
    },
  ];

  return (
    <ProTable<Case>
      columns={myCasesColumns}
      request={fetchCaseList}
      scroll={{ x: 1300 }}
      // options={false}
      rowKey={(e) => e._id ?? 'key'}
      headerTitle="所有案件"
      toolBarRender={() => []}
    />
  );
}
