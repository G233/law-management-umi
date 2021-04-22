import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Form, AutoComplete, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import ProForm, {
  ProFormText,
  ProFormTextArea,
  ProFormRadio,
  ProFormUploadDragger,
  ProFormSelect,
  ModalForm,
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
} from '@/services/cases';

export default function CreateCase() {
  interface optionType {
    value: string;
    label?: string;
  }
  const numReg = /^[0-9]*$/;
  const { initialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser;

  const [caseCauseList, setCaseCauseList] = useState<optionType[]>();

  // 获取案由自动完成的列表
  const initAutoData = async () => {
    setCaseCauseList(await fetchCaseCauseList());
  };

  useEffect(() => {
    initAutoData();
  }, []);

  const fieldProps = {
    customRequest: (data: any) => {
      uploadFile(data, userInfo?.uid as string);
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
        trigger={<Button type="primary">新建审批案件</Button>}
        onFinish={async (values) => {
          await createCase(values);
          return true;
        }}
      >
        <ProForm.Group>
          <Form.Item
            rules={[
              {
                required: true,
                message: '请输入案由',
              },
            ]}
            name="caseCause"
            label="案由"
          >
            <AutoComplete
              options={caseCauseList}
              style={{ width: 200 }}
              filterOption
              placeholder="请输入案由"
            />
          </Form.Item>
          <ProFormSelect
            name="undertaker"
            label="承办律师"
            request={fetchLawList}
            placeholder="选择承办律师"
            rules={[{ required: true, message: '请选择承办律师' }]}
            width="md"
            showSearch={true}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormText
            name="litigant"
            label="委托当事人姓名(名称)"
            width="md"
            placeholder="请输入委托当事人姓名(名称)"
            rules={[
              {
                required: true,
                message: '请输入委托当事人姓名(名称)',
              },
            ]}
          />
          <ProFormText
            name="otherlitigant"
            label="对方当事人姓名(名称)"
            width="md"
            placeholder="请输入对方当事人姓名(名称)"
            rules={[
              {
                required: true,
                message: '请输入对方当事人姓名(名称)',
              },
            ]}
          />
          <ProFormText
            name="litigantPhone"
            label="委托当事人联系方式"
            placeholder="请输入委托当事人联系方式"
            rules={[
              {
                required: true,
                message: '请输入委托当事人联系方式',
              },
              {
                pattern: numReg,
                message: '请输入正确格式的手机号',
              },
            ]}
            width="md"
          />
        </ProForm.Group>
        <ProFormTextArea
          name="litigantSituation"
          label="委托当事人基本情况"
          placeholder="请输入委托当事人基本情况"
          rules={[
            {
              required: true,
              message: '请输入委托当事人基本情况',
            },
          ]}
        />
        <ProFormTextArea
          name="otherLitigantSituation"
          label="对方当事人基本情况"
          placeholder="请输入对方当事人基本情况"
          rules={[
            {
              required: true,
              message: '请输入对方当事人基本情况',
            },
          ]}
        />
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
          placeholder="请输入承办人基本意见"
          rules={[
            {
              required: true,
              message: '请输入承办人基本意见',
            },
          ]}
        />
        <ProFormRadio.Group
          name="CaseType"
          label="案件类别"
          radioType="button"
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
              label: CaseTypeText[CaseType.Criminal],
              value: CaseType.Criminal,
            },
            {
              label: CaseTypeText[CaseType.Administrative],
              value: CaseType.Administrative,
            },
          ]}
        />
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
