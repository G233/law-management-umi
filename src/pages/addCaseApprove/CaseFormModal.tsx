import { useEffect, useRef } from 'react';
import { useModel, useAccess } from 'umi';
import { Form, AutoComplete, Button, message } from 'antd';
import type { ActionType } from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import useSafeState from '@/hook/useSafeState/index';

import ProForm, {
  ProFormText,
  ProFormTextArea,
  ProFormRadio,
  ProFormUploadDragger,
  ProFormSelect,
  ModalForm,
  ProFormDependency,
} from '@ant-design/pro-form';

import {
  createCase,
  changeCase,
  Case,
  CaseType,
  CaseTypeText,
  fetchCaseCauseList,
  fetchLawList,
  uploadFile,
  downloadFile,
  text,
  agencyStageList,
} from '@/services/cases';

export enum FormType {
  create,
  change,
}

interface CaseFormModalProps {
  type: FormType;
  case?: Case;
  tableRef: React.MutableRefObject<ActionType | undefined>;
  trigger?: JSX.Element;
}

export const CaseFormModal: React.FC<CaseFormModalProps> = (props) => {
  const { type, case: caseData, tableRef, trigger } = props;
  interface OptionType {
    value: string;
    label?: string;
  }
  const numReg = /^[0-9]*$/;
  const { initialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser;
  const { admin } = useAccess();
  const [caseCauseList, setCaseCauseList] = useSafeState<OptionType[]>();

  const initAutoData = async () => {
    setCaseCauseList(await fetchCaseCauseList());
  };
  const formRef = useRef<FormInstance>();

  useEffect(() => {
    initAutoData();
  }, []);

  const fieldProps = {
    customRequest: (data: any) => {
      const result = uploadFile(data, userInfo?.unionId as string);
      if (result) {
        message.success('附件上传成功');
      } else {
        message.error('附件上传失败');
      }
    },
    onDownload: (file: any) => {
      const result = downloadFile(file);
      if (result) {
        message.success('附件下载成功');
      } else {
        message.error('附件下载失败');
      }
    },
    showUploadList: {
      showDownloadIcon: true,
    },
  };

  return (
    <div>
      <ModalForm<Case>
        title={type === FormType.create ? '新建审批案件' : '修改案件信息'}
        formRef={formRef}
        trigger={
          trigger || (
            <Button type="primary">
              {type === FormType.create ? '新建审批' : '修改'}
            </Button>
          )
        }
        autoFocusFirstInput
        modalProps={{
          onCancel: () => {
            console.log('run');
            formRef.current?.resetFields();
          },
          destroyOnClose: true,
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          const unionId = userInfo?.unionId as string;
          
          // Generate unique filename for attachments to avoid overwrite
          if (values.attachment && values.attachment.length > 0) {
            values.attachment = values.attachment.map((file: any) => {
              if (file.originFileObj) {
                const timestamp = Date.now();
                const ext = file.name.split('.').pop();
                const basename = file.name.replace(/\.[^/.]+$/, '');
                file.name = `${basename}_${timestamp}.${ext}`;
              }
              return file;
            });
          }

          if (type === FormType.create) {
            await createCase(values, unionId);
          } else if (caseData) {
            await changeCase(values, unionId, caseData._id);
          }
          
          tableRef.current?.reload();
          message.success(
            type === FormType.create ? '新建案件成功' : '修改案件成功'
          );
          formRef.current?.resetFields();
          return true;
        }}
        initialValues={type === FormType.change ? caseData : undefined}
        width={800}
      >
        <ProFormRadio.Group
          name="CaseType"
          label="案件类别"
          radioType="button"
          options={[
            {
              label: CaseTypeText[CaseType.Civil],
              value: CaseType.Civil,
            },
            {
              label: CaseTypeText[CaseType.Administrative],
              value: CaseType.Administrative,
            },
            {
              label: CaseTypeText[CaseType.Criminal],
              value: CaseType.Criminal,
            },
          ]}
        />
        <ProFormDependency name={['CaseType']}>
          {(data) => {
            const caseType: CaseType = data.CaseType;
            return (
              <div>
                <ProForm.Group>
                  <ProFormText
                    name="caseCause"
                    label={text[caseType].caseCause}
                    renderFormItem={() => (
                      <Form.Item name="caseCause" label="">
                        <AutoComplete
                          options={caseCauseList}
                          style={{ width: 200 }}
                          filterOption
                        />
                      </Form.Item>
                    )}
                  />
                  <ProFormText
                    rules={[
                      {
                        required: true,
                        message: '请输入委托当事人姓名',
                      },
                    ]}
                    width="md"
                    name="litigant"
                    label={text[caseType].litigant}
                  />
                </ProForm.Group>
                <ProForm.Group>
                  <ProFormText
                    width="md"
                    name="otherlitigant"
                    label={text[caseType].otherlitigant}
                  />

                  <ProFormSelect
                    name="undertaker"
                    label="承办律师"
                    width="sm"
                    request={fetchLawList}
                    placeholder="选择承办律师"
                    showSearch={true}
                  />
                </ProForm.Group>
                <ProForm.Group>
                  <ProFormText
                    rules={[
                      {
                        pattern: numReg,
                        message: '请输入数字',
                      },
                    ]}
                    width="md"
                    name="proposedFees"
                    label="拟收费用（元）"
                  />
                  <ProFormSelect
                    name="agencyStage"
                    label="代理阶段"
                    valueEnum={agencyStageList}
                    placeholder="请选择代理阶段"
                    rules={[
                      { required: true, message: '请选择代理阶段' },
                    ]}
                  />
                </ProForm.Group>

                <ProFormTextArea
                  width="xl"
                  name="caseSituation"
                  label={text[caseType].caseSituation}
                />

                <ProFormTextArea
                  width="xl"
                  name="opinionBoss"
                  label="主任意见"
                />

                {admin ? (
                  <ProFormUploadDragger
                    name="attachment"
                    label="附件"
                    {...fieldProps}
                  />
                ) : null}
              </div>
            );
          }}
        </ProFormDependency>
      </ModalForm>
    </div>
  );
};
