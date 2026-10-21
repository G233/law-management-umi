import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';

import { useCommonColumns } from '../CaseApprove/useCommonColumns';
import { Case, fetchMyCases, requestProp } from '@/services/cases';

export default function MyCases() {
  const { initialState } = useModel('@@initialState');
  const unionId = initialState?.currentUser?.unionId;
  const commonColumns = useCommonColumns();
  const myCasesColumns: ProColumns<Case>[] = [...commonColumns];

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
