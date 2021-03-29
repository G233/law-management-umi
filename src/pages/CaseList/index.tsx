import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';

import type { ProColumns } from '@ant-design/pro-table';

import { Case, fetchMyCases } from '@/services/cases';

export default function CaseList() {
  const { initialState } = useModel('@@initialState');
  const openId = initialState?.currentUser?.uid;
  const myCasesColumns: ProColumns<Case>[] = [
    {
      title: '案由',
      width: 80,
      dataIndex: 'caseCause', // 列数据在数据项中对应的路径，支持通过数组查询嵌套路径，设置了这个值就无需 key
      fixed: 'left',
    },
    {
      title: '当事人名称',
      width: 80,
      dataIndex: 'litigant',
      align: 'center',
    },
    {
      title: '当事人联系方式',
      width: 80,
      dataIndex: 'litigantPhone',
      align: 'center',
    },
    {
      title: '承办律师',
      width: 60,
      align: 'center',
      dataIndex: 'undertakerName',
    },
    {
      title: '立案时间',
      width: 100,
      dataIndex: 'createTime',
      align: 'center',
      valueType: 'date',
    },
    {
      title: '案件基本情况',
      dataIndex: 'caseSituation',
      ellipsis: true,
      align: 'center',
      width: 160,
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
      request={() => fetchMyCases(openId as string)}
      scroll={{ x: 1300 }}
      options={false}
      search={false}
      rowKey={(e) => e._id ?? 'key'}
      headerTitle="待审批案件"
      toolBarRender={() => []}
    />
  );
}
