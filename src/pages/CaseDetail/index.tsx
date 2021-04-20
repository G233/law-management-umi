import { useState, useEffect } from 'react';
import { useModel, useLocation } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Form, AutoComplete, Result, Button } from 'antd';
import ProForm, {
  ProFormText,
  ProFormTextArea,
  ProFormRadio,
  ProFormUploadDragger,
  ProFormSelect,
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
import { cloudFIndById } from '@/services/until';

export default function CreateCasePage() {
  interface optionType {
    value: string;
    label?: string;
  }
  const location = useLocation();
  //@ts-ignore
  const caseId: string | undefined = location?.query?.id;
  const { initialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser;
  const [caseData, setCaseData] = useState<Case>();
  const [readonly, setReadonly] = useState<boolean>(true);

  const [caseCauseList, setCaseCauseList] = useState<optionType[]>();
  let formI = Form.useForm();

  // 获取案由自动完成的列表
  const initAutoData = async () => {
    setCaseCauseList(await fetchCaseCauseList());
  };
  const initData = async (caseId: string | undefined) => {
    if (!caseId) return;
    const res = await cloudFIndById('Cases', caseId);
    setCaseData(res);
    formI[0].resetFields();
    console.log(formI);
  };

  useEffect(() => {
    // initAutoData();
    initData(caseId);
  }, []);

  const fieldProps = {
    customRequest: (data: any) => {
      uploadFile(data, userInfo?.uid as string);
    },
    onDownload: downloadFile,
    showUploadList: {
      showDownloadIcon: true,
      showRemoveIcon: false,
    },
  };
  const headerprops = {
    onBack: () => history.back(),
  };

  return (
    <div>
      <PageContainer header={headerprops}>
        {caseId ? (
          <ProCard>
            <ProForm
              submitter={{
                render: () => null,
              }}
              form={formI[0]}
              initialValues={caseData}
              onFinish={async (values) => {
                await createCase(values as Case);
              }}
            >
              <ProForm.Group>
                <Form.Item name="caseCause" label="案由">
                  <AutoComplete
                    disabled={readonly}
                    options={caseCauseList}
                    style={{ width: 200 }}
                    filterOption
                    placeholder="请输入案由"
                  />
                </Form.Item>
                <ProFormSelect
                  readonly={readonly}
                  name="undertaker"
                  label="承办律师"
                  request={fetchLawList}
                  placeholder="选择承办律师"
                  showSearch={true}
                />
              </ProForm.Group>

              <ProForm.Group>
                <ProFormText
                  readonly={readonly}
                  name="litigant"
                  label="当事人名称"
                  width="md"
                  placeholder="请输入当事人名字"
                />
                <ProFormText
                  readonly={readonly}
                  name="litigantPhone"
                  label="当事人联系方式"
                  placeholder="请输入当事人联系方式"
                  width="md"
                />
              </ProForm.Group>
              <ProFormTextArea
                readonly={readonly}
                name="litigantSituation"
                label="当事人基本情况"
                placeholder="请输入当事人基本情况"
              />
              <ProFormTextArea
                readonly={readonly}
                name="otherLitigantSituation"
                label="对方当事人基本情况"
                placeholder="请输入当事人基本情况"
              />
              <ProFormTextArea
                readonly={readonly}
                name="clientSituation"
                label="委托人基本要求"
                placeholder="请输入委托人基本要求"
              />
              <ProFormTextArea
                readonly={readonly}
                name="caseSituation"
                label="案件基本情况"
                placeholder="请输入案件基本情况"
              />
              <ProFormTextArea
                readonly={readonly}
                name="undertakerOpinion"
                label="承办人基本意见"
                placeholder="请输入承办人基本意见"
              />
              <ProFormRadio.Group
                readonly={readonly}
                name="CaseType"
                label="案件类别"
                radioType="button"
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
              <ProFormUploadDragger
                readonly={readonly}
                label="附件"
                name="annex"
                fieldProps={fieldProps}
              />
            </ProForm>
          </ProCard>
        ) : (
          <Result
            status="500"
            title="请输入案件 id 进行查询"
            extra={
              <Button type="primary" onClick={() => history.back()}>
                返回上个页面
              </Button>
            }
          />
        )}
      </PageContainer>
    </div>
  );
}
