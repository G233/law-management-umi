import { useEffect, useRef } from 'react';
import { useModel, useAccess } from 'umi';
import { Form, AutoComplete, Button } from 'antd';
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
  Case,
  CaseType,
  CaseTypeText,
  fetchCaseCauseList,
  fetchLawList,
  uploadFile,
  downloadFile,
  agencyStageCivil,
  agencyStageCivilText,
} from '@/services/cases';

const normalText = {
  caseCause: '案由',
  agencyStage: '代理阶段',
  litigant: '委托当事人姓名(名称)',
  litigantSituation: '委托当事人基本情况',
  litigantPhone: '委托当事人联系方式',
};

export const text = {
  [CaseType.Criminal]: {
    caseCause: '涉案罪名',
    agencyStage: '辩护阶段',
    litigant: '犯罪嫌疑人或被告人姓名(名称)',
    litigantSituation: '犯罪嫌疑人或被告人基本情况',
    litigantPhone: '犯罪嫌疑人或被告人联系方式',
  },
  [CaseType.Civil]: normalText,
  [CaseType.Administrative]: normalText,
};

export const agencyStageList = {
  [CaseType.Criminal]: {
    [agencyStageCivil.侦查阶段]:
      agencyStageCivilText[agencyStageCivil.侦查阶段],
    [agencyStageCivil.审查起诉阶段]:
      agencyStageCivilText[agencyStageCivil.审查起诉阶段],
    [agencyStageCivil.审判阶段]:
      agencyStageCivilText[agencyStageCivil.审判阶段],
  },
  [CaseType.Civil]: {
    [agencyStageCivil.一审]: agencyStageCivilText[agencyStageCivil.一审],
    [agencyStageCivil.二审]: agencyStageCivilText[agencyStageCivil.二审],
    [agencyStageCivil.再审]: agencyStageCivilText[agencyStageCivil.再审],
    [agencyStageCivil.执行]: agencyStageCivilText[agencyStageCivil.执行],
  },
  [CaseType.Administrative]: {
    [agencyStageCivil.一审]: agencyStageCivilText[agencyStageCivil.一审],
    [agencyStageCivil.二审]: agencyStageCivilText[agencyStageCivil.二审],
    [agencyStageCivil.再审]: agencyStageCivilText[agencyStageCivil.再审],
    [agencyStageCivil.执行]: agencyStageCivilText[agencyStageCivil.执行],
  },
};

export default function CreateCase() {
  interface optionType {
    value: string;
    label?: string;
  }
  const numReg = /^[0-9]*$/;
  const { initialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser;
  const { admin } = useAccess();
  const [caseCauseList, setCaseCauseList] = useSafeState<optionType[]>();

  // 获取案由自动完成的列表
  const initAutoData = async () => {
    setCaseCauseList(await fetchCaseCauseList());
  };
  const formRef = useRef<FormInstance>();

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
    },
  };

  return (
    <div>
      <ModalForm<Case>
        title="新建审批案件"
        formRef={formRef}
        trigger={<Button type="primary">新建审批案件</Button>}
        onFinish={async (values) => {
          console.log(values);
          // await createCase(values, userInfo?.unionId as string);
          // formRef.current?.resetFields();
          // return true;
        }}
      >
        <ProFormRadio.Group
          name="CaseType"
          label="案件类别"
          radioType="button"
          initialValue={CaseType.Civil}
          rules={[
            {
              required: true,
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
                        required: true,
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
                    />
                  </Form.Item>
                  {admin && (
                    <ProFormSelect
                      name="undertaker"
                      initialValue={userInfo?.unionId}
                      label="承办律师"
                      request={fetchLawList}
                      placeholder="选择承办律师"
                      rules={[{ required: true, message: '请选择承办律师' }]}
                      width="md"
                      showSearch={true}
                    />
                  )}
                </ProForm.Group>
                <ProForm.Group>
                  <ProFormText
                    name="litigant"
                    label={`${text[caseType]?.litigant}`}
                    width="md"
                    placeholder={`${text[caseType]?.litigant}`}
                    rules={[
                      {
                        required: true,
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
                    />
                  )}
                </ProForm.Group>
                <ProForm.Group>
                  <ProFormText
                    name="litigantPhone"
                    label={`请输入${text[caseType]?.litigantPhone}`}
                    placeholder={`请输入${text[caseType]?.litigantPhone}`}
                    rules={[
                      {
                        required: true,
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
                    rules={[
                      {
                        required: true,
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
                  rules={[
                    {
                      required: true,
                      message: '请输入所需信息',
                    },
                  ]}
                />
                {caseType !== CaseType.Criminal && (
                  <ProFormTextArea
                    name="otherLitigantSituation"
                    label="对方当事人基本情况"
                    placeholder="请输入对方当事人基本情况"
                  />
                )}
                {caseType !== CaseType.Criminal && (
                  <ProFormTextArea
                    name="clientSituation"
                    label="委托人基本要求"
                    placeholder="请输入委托人基本要求"
                    rules={[
                      {
                        required: true,
                        message: '请输入委托人基本要求',
                      },
                    ]}
                  />
                )}
                <ProFormTextArea
                  name="caseSituation"
                  label="案件基本情况"
                  placeholder="请输入案件基本情况"
                  rules={[
                    {
                      required: true,
                      message: '请输入案件基本情况',
                    },
                  ]}
                />
                <ProFormTextArea
                  name="undertakerOpinion"
                  label="承办人基本意见"
                  placeholder="请输入承办律师意见"
                  rules={[
                    {
                      required: true,
                      message: '请输入承办律师意见',
                    },
                  ]}
                />
                <ProFormTextArea
                  name="toll"
                  label="拟收取律师费金额及说明"
                  placeholder="请输入拟收取律师费金额及说明"
                />
              </div>
            );
          }}
        </ProFormDependency>

        {/* TODO:多文件上传 */}
        <ProFormUploadDragger
          label="附件"
          name="annex"
          fieldProps={fieldProps}
        />
      </ModalForm>
    </div>
  );
}
