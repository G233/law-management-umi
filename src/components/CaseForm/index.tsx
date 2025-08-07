import { useEffect } from 'react';
import { useModel } from 'umi';
import { Form, AutoComplete } from 'antd';
import useSafeState from '@/hook/useSafeState/index';

import ProForm, {
  ProFormText,
  ProFormTextArea,
  ProFormRadio,
  ProFormUploadDragger,
  ProFormSelect,
  ProFormDependency,
} from '@ant-design/pro-form';

import {
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

export enum formType {
    create,
    change,
}

interface CaseFormProps {
  readonly?: boolean;
}

interface optionType {
    value: string;
    label?: string;
}

export const CaseForm = (props: CaseFormProps) => {
  const { readonly = false } = props;
  const numReg = /^[0-9]*$/;
  const { initialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser;
  const [caseCauseList, setCaseCauseList] = useSafeState<optionType[]>();

  // 获取案由自动完成的列表
  const initAutoData = async () => {
    setCaseCauseList(await fetchCaseCauseList());
  };

  useEffect(() => {
    initAutoData();
  }, []);

  const fieldProps = {
    customRequest: (data: any) => {
      uploadFile(data, userInfo?.unionId as string);
    },
    onDownload: downloadFile,
    showUploadList: {
      showDownloadIcon: true,
      showRemoveIcon: !readonly,
    },
  };

  return (
    <>
        <ProFormRadio.Group
          name="CaseType"
          label="案件类别"
          radioType="button"
          initialValue={CaseType.Civil}
          readonly={readonly}
          rules={[
            {
              required: !readonly,
              message: '请选择案件类别',
            },
          ]}
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
                  <Form.Item
                    rules={[
                      {
                        required: !readonly,
                        message: '请输入所需信息',
                      },
                    ]}
                    name="caseCause"
                    label={`${text[caseType]?.caseCause}`}
                  >
                    <AutoComplete
                      options={caseCauseList}
                      style={{ width: 200 }}
                      filterOption
                      placeholder={`请输入${text[caseType]?.caseCause}`}
                      disabled={readonly}
                    />
                  </Form.Item>
                  <ProFormSelect
                    name="undertaker"
                    initialValue={userInfo?.unionId}
                    label="承办律师"
                    request={fetchLawList}
                    placeholder="选择承办律师"
                    rules={[{ required: !readonly, message: '请选择承办律师' }]}
                    width="md"
                    showSearch={true}
                    readonly={readonly}
                  />
                </ProForm.Group>
                <ProForm.Group>
                  <ProFormText
                    name="litigant"
                    label={`${text[caseType]?.litigant}`}
                    width="md"
                    placeholder={`${text[caseType]?.litigant}`}
                    readonly={readonly}
                    rules={[
                      {
                        required: !readonly,
                        message: '请输入所需信息',
                      },
                    ]}
                  />
                  {caseType !== CaseType.Criminal && (
                    <ProFormText
                      name="otherlitigant"
                      label="对方当事人姓名(名称)"
                      width="md"
                      placeholder="请输入对方当事人姓名(名称)"
                      readonly={readonly}
                    />
                  )}
                </ProForm.Group>
                <ProForm.Group>
                  <ProFormText
                    name="litigantPhone"
                    label={`${text[caseType]?.litigantPhone}`}
                    placeholder={`请输入${text[caseType]?.litigantPhone}`}
                    readonly={readonly}
                    rules={[
                      {
                        required: !readonly,
                        message: '请输入所需信息',
                      },
                      {
                        pattern: numReg,
                        message: '请输入正确格式的手机号',
                      },
                    ]}
                    width="md"
                  />
                  <ProFormSelect
                    name="agencyStage"
                    label={`${text[caseType]?.agencyStage}`}
                    placeholder={`请选择${text[caseType]?.agencyStage}`}
                    showSearch={true}
                    valueEnum={agencyStageList[caseType]}
                    readonly={readonly}
                    rules={[
                      {
                        required: !readonly,
                        message: '请选择阶段',
                      },
                    ]}
                    width="md"
                  />
                </ProForm.Group>
                <ProFormTextArea
                  name="litigantSituation"
                  label={`${text[caseType]?.litigantSituation}`}
                  placeholder={`请输入${text[caseType]?.litigantSituation}`}
                  readonly={readonly}
                  rules={[
                    {
                      required: !readonly,
                      message: '请输入所需信息',
                    },
                  ]}
                />
                {caseType !== CaseType.Criminal && (
                  <ProFormTextArea
                    name="otherLitigantSituation"
                    label="对方当事人基本情况"
                    placeholder="请输入对方当事人基本情况"
                    readonly={readonly}
                  />
                )}
                {caseType !== CaseType.Criminal && (
                  <ProFormTextArea
                    name="clientSituation"
                    label="委托人基本要求"
                    placeholder="请输入委托人基本要求"
                    readonly={readonly}
                    rules={[
                      {
                        required: !readonly,
                        message: '请输入委托人基本要求',
                      },
                    ]}
                  />
                )}
                <ProFormTextArea
                  name="caseSituation"
                  label="案件基本情况"
                  placeholder="请输入案件基本情况"
                  readonly={readonly}
                  rules={[
                    {
                      required: !readonly,
                      message: '请输入案件基本情况',
                    },
                  ]}
                />
                <ProFormTextArea
                  name="undertakerOpinion"
                  label="承办人基本意见"
                  placeholder="请输入承办律师意见"
                  readonly={readonly}
                  rules={[
                    {
                      required: !readonly,
                      message: '请输入承办律师意见',
                    },
                  ]}
                />
                <ProFormTextArea
                  name="toll"
                  label="拟收取律师费金额及说明"
                  placeholder="请输入拟收取律师费金额及说明"
                  readonly={readonly}
                />
              </div>
            );
          }}
        </ProFormDependency>

        <ProFormUploadDragger
          label="附件"
          name="annex"
          fieldProps={fieldProps}
          readonly={readonly}
        />
    </>
  );
};
