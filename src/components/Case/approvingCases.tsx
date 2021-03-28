import { useState, useRef } from 'react';
import { useModel } from 'umi';
import { Button, Space, Table, Row, Col } from 'antd';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-form';
import type { ProColumns, ActionType } from '@ant-design/pro-table';

import {
  Case,
  fetchApprovingCases,
  oneClickApprove,
  CaseStatus,
} from '@/services/cases';

export default function approvingCases() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedCasesId, setSelectedCasesId] = useState<(string | number)[]>();
  const { initialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser;

  const approvingColumns: ProColumns<Case>[] = [
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
      width: 160,
    },
    {
      title: '操作',
      width: 100,
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      render: (e) => [
        <div key="action">
          <Row justify="center">
            <Col span={10}>
              <Button type="link">同意</Button>
            </Col>
            <Col span={10}>
              <Button type="link" danger>
                拒绝
              </Button>
            </Col>
          </Row>
          <Row justify="center">
            <Col>
              <Button type="text">查看详情</Button>
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
