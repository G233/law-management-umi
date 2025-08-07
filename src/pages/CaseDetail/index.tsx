import { useEffect, useState } from 'react';
import { useLocation } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Result, Button } from 'antd';
import ProForm from '@ant-design/pro-form';
import ProSkeleton from '@ant-design/pro-skeleton';
import { Case } from '@/services/cases';
import { cloudFIndById } from '@/services/until';
import { CaseForm } from '@/components/CaseForm';
import styles from './index.less';

export default function CaseDetailPage() {
  const location = useLocation();
  // @ts-ignore
  const caseId: string | undefined = location?.query?.id;
  const [caseData, setCaseData] = useState<Case | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async (id: string | undefined) => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const res = await cloudFIndById('Cases', id);
        setCaseData(res);
      } catch (error) {
        console.error("Failed to fetch case data", error);
      } finally {
        setLoading(false);
      }
    };

    initData(caseId);
  }, [caseId]);

  const headerprops = {
    onBack: () => history.back(),
  };

  if (loading) {
    return (
      <PageContainer header={headerprops}>
        <ProCard>
          <ProSkeleton type="form" />
        </ProCard>
      </PageContainer>
    );
  }

  if (!caseData) {
    return (
      <PageContainer header={headerprops}>
        <Result
          status="404"
          title="未找到案件"
          subTitle="请检查案件 ID 是否正确"
          extra={
            <Button type="primary" onClick={() => history.back()}>
              返回
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <div className={styles.main}>
      <PageContainer header={headerprops}>
        <ProCard>
          <ProForm
            initialValues={caseData}
            submitter={{
              render: () => null,
            }}
          >
            <CaseForm readonly />
          </ProForm>
        </ProCard>
      </PageContainer>
    </div>
  );
}
