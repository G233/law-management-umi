import { useState, useRef } from 'react';
import { useModel } from 'umi';
import { Button, Space, Table, Row, Col } from 'antd';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-form';
import type { ProColumns, ActionType } from '@ant-design/pro-table';

import {
  Cases,
  fetchApprovingCases,
  oneClickApprove,
  CaseStatus,
} from '@/services/cases';

export default function approvingCases() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedCasesId, setSelectedCasesId] = useState<(string | number)[]>();
  const { initialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser;

  const approvingColumns: ProColumns<Cases>[] = [
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
      render: (e) => [
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

  const ref = useRef<ActionType>();

  return (
    <>
      <ProTable<Cases>
        columns={approvingColumns}
        // actionRef={(e) => test(e)}
        actionRef={ref}
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
        tableAlertOptionRender={({ selectedRowKeys }) => {
          return (
            <Space size={16}>
              <Button
                onClick={() =>
                  oneClickApprove(
                    selectedRowKeys as string[],
                    ref as React.MutableRefObject<ActionType>,
                    userInfo?.uid as string,
                    CaseStatus.AGREE,
                  )
                }
                type="link"
              >
                都同意
              </Button>
              <Button
                type="link"
                onClick={() => {
                  setIsShowModal(true);
                  setSelectedCasesId(selectedRowKeys);
                }}
              >
                都不同意
              </Button>
            </Space>
          );
        }}
        scroll={{ x: 1300 }}
        options={false}
        search={false}
        rowKey={(e) => e._id ?? 'key'}
        headerTitle="待审批案件"
      />
      <ModalForm<{
        msg: string;
      }>
        title="审批意见"
        visible={isShowModal}
        modalProps={{
          onCancel: () => setIsShowModal(false),
        }}
        onFinish={async (values) => {
          await oneClickApprove(
            selectedCasesId as string[],
            ref as React.MutableRefObject<ActionType>,
            userInfo?.uid as string,
            CaseStatus.REJECT,
            values.msg,
          );
          setIsShowModal(false);
          return true;
        }}
      >
        <ProFormTextArea name="msg" />
      </ModalForm>
    </>
  );
}
