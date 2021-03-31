import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import MyCases from '@/components/Case/myCaseList';

export default function CasesPage() {
  return (
    <div>
      <PageContainer>
        <ProCard>
          <MyCases />
        </ProCard>
      </PageContainer>
    </div>
  );
}