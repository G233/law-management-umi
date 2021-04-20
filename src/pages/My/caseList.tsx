import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';

import { commonColumns } from '@/pages/CaseApprove/tableColumns';
import { Case, fetchMyCases, requestProp } from '@/services/cases';

export default function myCases() {
  const { initialState } = useModel('@@initialState');
  const openId = initialState?.currentUser?.uid;
  const myCasesColumns: ProColumns<Case>[] = [...commonColumns()];

  return (
    <ProTable<Case>
      columns={myCasesColumns}
      request={(data: requestProp) => fetchMyCases({ ...data, openId })}
      scroll={{ x: 1300 }}
      search={false}
      rowKey={(e) => e._id ?? 'key'}
      headerTitle="我的案件"
    />
  );
}
