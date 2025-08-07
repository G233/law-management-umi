import { useRef } from 'react';
import { useModel } from 'umi';
import { Button, message } from 'antd';
import type { ActionType } from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import { ModalForm } from '@ant-design/pro-form';

import {
  createCase,
  changeCase,
  Case,
} from '@/services/cases';
import { CaseForm, formType } from '@/components/CaseForm';

interface CreateCaseProps {
  type: formType;
  case?: Case;
  tableRef: React.MutableRefObject<ActionType | undefined>;
}

export const caseForm = (props: CreateCaseProps) => {
  const { type } = props;
  const { initialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser;
  const formRef = useRef<FormInstance>();

  return (
    <ModalForm<Case>
      title={type === formType.create ? '新建审批案件' : '修改案件信息'}
      formRef={formRef}
      trigger={
        type === formType.create ? (
          <Button type="primary">新建审批案件</Button>
        ) : (
          <Button type="link">更改信息</Button>
        )
      }
      initialValues={props.case}
      onFinish={async (values) => {
        if (type === formType.create) {
          await createCase(values, userInfo?.unionId as string);
          message.success('新建成功，等待审批中');
        } else {
          await changeCase(
            values,
            userInfo?.unionId as string,
            props.case!._id!,
          );
          message.success('案件信息修改成功，重新等待审批中');
        }
        formRef.current?.resetFields();
        props.tableRef.current?.reloadAndRest!();
        return true;
      }}
    >
      <CaseForm />
    </ModalForm>
  );
};
