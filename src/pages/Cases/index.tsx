import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Button, Space, Table, Row, Col } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { Cases, fetchApprovingCases } from '@/services/cases';

// 审批列表，有权限的人才能看到。待沟通
export default function CasesPage() {
  enum CaseListType {
    done = 'done', //已审批
    undone = 'undone', // 待审批
  }

  const [tab, setTab] = useState<CaseListType>(CaseListType.undone);

  const columns: ProColumns<Cases>[] = [
    {
      title: '案件名称',
      width: 90,
      dataIndex: 'title', // 列数据在数据项中对应的路径，支持通过数组查询嵌套路径，设置了这个值就无需 key
      fixed: 'left',
    },
    {
      title: '涉案金额',
      width: 120,
      dataIndex: 'amount',
      align: 'center',
      search: false,
      valueType: 'money',
      // TODO: 排序 sorter: (a, b) => a.containers - b.containers,
    },
    {
      title: '收费',
      width: 120,
      align: 'center',
      dataIndex: 'toll',
      valueType: 'money',
    },
    {
      title: '当事人',
      dataIndex: 'litigant',
      width: 120,
      align: 'center',
    },
    {
      title: '被告人',
      dataIndex: 'Defendant',
      width: 80,
      align: 'center',
    },

    {
      title: '创建时间',
      width: 140,
      dataIndex: 'createTime',
      align: 'center',
      valueType: 'date',
    },
    {
      title: '案件描述',
      dataIndex: 'description',
      ellipsis: true,
      align: 'center',
      width: 160,
    },
    {
      title: '操作',
      width: 100,
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      render: () => [
        //  这个 row 不加 key 会报错
        <Row key="key">
          <Col span={12}>
            <Button type="link">同意</Button>
          </Col>
          <Col span={12}>
            <Button type="link" danger>
              拒绝
            </Button>
          </Col>
        </Row>,
      ],
    },
  ];

  return (
    <div>
      <PageContainer>
        <ProCard
          tabs={{
            tabPosition: 'top',
            activeKey: tab,
            onChange: (key) => {
              setTab(key as CaseListType);
            },
          }}
        >
          <ProCard.TabPane key={CaseListType.undone} tab="待审批案件">
            <ProTable<Cases>
              columns={columns}
              rowSelection={{
                // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
                // 注释该行则默认不显示下拉选项
                selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
              }}
              request={fetchApprovingCases}
              tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
                <Space size={24}>
                  <span>
                    已选 {selectedRowKeys.length} 项
                    <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                      取消选择
                    </a>
                  </span>
                </Space>
              )}
              tableAlertOptionRender={() => {
                return (
                  <Space size={16}>
                    <a>批量同意</a>
                    <a>批量拒绝</a>
                  </Space>
                );
              }}
              scroll={{ x: 1300 }}
              options={false}
              search={false}
              rowKey={(e) => e._id ?? 'key'}
              headerTitle="待审批案件"
              toolBarRender={() => [
                <Button type="primary" key="show">
                  一键通过审批
                </Button>,
              ]}
            />
          </ProCard.TabPane>
          <ProCard.TabPane key={CaseListType.done} tab="已审批案件">
            已审批案件
          </ProCard.TabPane>
        </ProCard>
      </PageContainer>
    </div>
  );
}
