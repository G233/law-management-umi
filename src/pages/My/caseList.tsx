import ProTable from '@ant-design/pro-table';
import { useModel } from '@umijs/max';
import type { ProColumns } from '@ant-design/pro-table';

import { commonColumns } from '@/pages/CaseApprove/tableColumns';
import { Case, fetchMyCases, requestProp } from '@/services/cases';

export default function myCases() {
  const { initialState } = useModel('@@initialState');
  const unionId = initialState?.currentUser?.unionId;
  const myCasesColumns: ProColumns<Case>[] = [...commonColumns()];

  return (
    <ProTable<Case>
      columns={myCasesColumns}
      request={(data: requestProp) => fetchMyCases({ ...data, unionId })}
      search={false}
      rowKey={(e) => e._id ?? 'key'}
      headerTitle="我的案件"
    />
  );
}
