import { Button } from 'antd';
import { history } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { commonColumns } from '@/pages/CaseApprove/tableColumns';
import { Case, fetchCaseList, CaseType, CaseTypeText } from '@/services/cases';

export default function CaseList() {
  const myCasesColumns: ProColumns<Case>[] = [
    ...commonColumns(),
    {
      title: '案件类别',
      dataIndex: 'CaseType',
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
      title: '操作',
      width: 40,
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      render: (_, record) => [
        <Button
          type="link"
          key="btn"
          onClick={() => {
            history.push({
              pathname: '/CaseDetail',
              query: {
                id: record._id as string,
              },
            });
          }}
        >
          查看详情
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<Case>
        columns={myCasesColumns}
        request={fetchCaseList}
        scroll={{ x: 1300 }}
        search={{
          labelWidth: 'auto',
          searchText: '搜索',
          resetText: '重置',
          defaultCollapsed: false,
        }}
        rowKey={(e) => e._id ?? 'key'}
        toolBarRender={() => []}
      />
    </PageContainer>
  );
}
