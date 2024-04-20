import { useEffect } from 'react';
import { useModel, useLocation, useAccess } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Form, Result, Button } from 'antd';
import ProForm, {
  ProFormText,
  ProFormTextArea,
  ProFormRadio,
  ProFormUploadDragger,
  ProFormSelect,
  ProFormDependency,
} from '@ant-design/pro-form';
import {
  createCase,
  Case,
  CaseType,
  CaseTypeText,
  fetchLawList,
  uploadFile,
  downloadFile,
  text,
  agencyStageList,
} from '@/services/cases';
import { cloudFIndById } from '@/services/until';
import styles from './index.less';
import useSafeState from '@/hook/useSafeState/index';

export default function CreateCasePage() {
  const location = useLocation();
  const { admin } = useAccess();
  const caseId: string | undefined = location?.search.split('?')[1];
  const { initialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser;
  const [readonly] = useSafeState<boolean>(true);

  const loadCaseInfo = async (caseId: string) => {
    const res = await cloudFIndById('Cases', caseId);
    return res;
  }

  const fieldProps = {
    customRequest: (data: any) => {
      uploadFile(data, userInfo?.unionId as string);
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
    <div className={styles.main}>
      <PageContainer header={headerprops}>
        {caseId ? (
          <ProCard>
            <ProForm
              submitter={{
                render: () => <div>1231231</div>,
              }}
              request={() => loadCaseInfo(caseId)}
            >
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
                          label={`${text[caseType]?.caseCause}`}
                          width="lg"
                          readonly={readonly}
                        />
                        {admin && (
                          <ProFormSelect
                            name="undertaker"
                            readonly={readonly}
                            label="承办律师"
                            request={fetchLawList}
                            placeholder="选择承办律师"
                            width="md"
                            showSearch={true}
                          />
                        )}
                      </ProForm.Group>
                      <ProForm.Group>
                        <ProFormText
                          readonly={readonly}
                          name="litigant"
                          label={`${text[caseType]?.litigant}`}
                          width="md"
                          placeholder={`${text[caseType]?.litigant}`}
                        />
                        {caseType !== CaseType.Criminal && (
                          <ProFormText
                            name="otherlitigant"
                            readonly={readonly}
                            label="对方当事人姓名(名称)"
                            width="md"
                            placeholder="请输入对方当事人姓名(名称)"
                          />
                        )}
                      </ProForm.Group>
                      <ProForm.Group>
                        <ProFormText
                          name="litigantPhone"
                          readonly={readonly}
                          label={`${text[caseType]?.litigantPhone}`}
                          placeholder={`请输入${text[caseType]?.litigantPhone}`}
                          width="md"
                        />
                        <ProFormSelect
                          name="agencyStage"
                          readonly={readonly}
                          label={`${text[caseType]?.agencyStage}`}
                          placeholder={`请选择${text[caseType]?.agencyStage}`}
                          showSearch={true}
                          valueEnum={agencyStageList[caseType]}
                          width="md"
                        />
                      </ProForm.Group>
                      <ProFormTextArea
                        name="litigantSituation"
                        readonly={readonly}
                        label={`${text[caseType]?.litigantSituation}`}
                        placeholder={`请输入${text[caseType]?.litigantSituation}`}
                      />
                      {caseType !== CaseType.Criminal && (
                        <ProFormTextArea
                          readonly={readonly}
                          name="otherLitigantSituation"
                          label="对方当事人基本情况"
                          placeholder="请输入对方当事人基本情况"
                        />
                      )}
                      {caseType !== CaseType.Criminal && (
                        <ProFormTextArea
                          name="clientSituation"
                          label="委托人基本要求"
                          readonly={readonly}
                          placeholder="请输入委托人基本要求"
                        />
                      )}
                      <ProFormTextArea
                        name="caseSituation"
                        readonly={readonly}
                        label="案件基本情况"
                        placeholder="请输入案件基本情况"
                      />
                      <ProFormTextArea
                        readonly={readonly}
                        name="undertakerOpinion"
                        label="承办人基本意见"
                        placeholder="请输入承办律师意见"
                      />
                      <ProFormTextArea
                        name="toll"
                        readonly={readonly}
                        label="拟收取律师费金额及说明"
                        placeholder="请输入拟收取律师费金额及说明"
                      />
                    </div>
                  );
                }}
              </ProFormDependency>

              {/* TODO:多文件上传 */}
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
            title="请输入案件 id 进行查看"
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
