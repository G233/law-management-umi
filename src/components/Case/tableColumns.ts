import { Case } from '@/services/cases';
import type { ProColumns } from '@ant-design/pro-table';

export const commonColumns: ProColumns<Case>[] = [
  {
    title: '案由',
    width: 80,
    dataIndex: 'caseCause', // 列数据在数据项中对应的路径，支持通过数组查询嵌套路径，设置了这个值就无需 key
  },
  {
    title: '当事人名称',
    width: 80,
    dataIndex: 'litigant',
    align: 'center',
  },
  {
    title: '承办律师',
    width: 60,
    align: 'center',
    dataIndex: 'undertakerName',
  },
  {
    title: '承办人基本意见',
    dataIndex: 'undertakerOpinion',
    ellipsis: true,
    width: 120,
    align: 'center',
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
