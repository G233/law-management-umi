import { useState, useRef } from 'react';
import { useModel } from 'umi';
import { Button, Space, Table, Row, Col } from 'antd';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-form';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { commonColumns } from '@/components/Case/tableColumns';

import {
  Case,
  fetchApprovingCases,
  oneClickApprove,
  CaseStatus,
} from '@/services/cases';

export default function approvingCases() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedCasesId, setSelectedCasesId] = useState<(string | number)[]>();
  const [argBtnLoding, setArgBtnLoding] = useState(false);

  const { initialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser;
  const approvingColumns: ProColumns<Case>[] = [
    ...commonColumns(),
    {
      title: '操作',
      width: 140,
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      render: (_, record) => [
        <div key={record._id}>
          <Row justify="center">
            <Col span={8}>
              <Button
                onClick={async () => {
                  setArgBtnLoding(true);
                  await oneClickApprove(
                    [record?._id as string],
                    ref as React.MutableRefObject<ActionType>,
                    userInfo?.uid as string,
                    CaseStatus.AGREE,
                  );
                  setArgBtnLoding(false);
                }}
                loading={argBtnLoding}
                type="link"
              >
                同意
              </Button>
            </Col>
            <Col span={8}>
              <Button
                type="link"
                danger
                onClick={async () => {
                  setIsShowModal(true);
                  setSelectedCasesId([record?._id as string]);
                }}
              >
                不同意
              </Button>
            </Col>
            <Col span={8}>
              <Button type="link">详情</Button>
            </Col>
          </Row>
        </div>,
      ],
    },
  ];

  const ref = useRef<ActionType>();

  return (
    <>
      <ProTable<Case>
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
