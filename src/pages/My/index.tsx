import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Outlet } from '@umijs/max';

export default function CasesPage() {
  return (
    <div>
      <PageContainer>
        <ProCard>
          <Outlet />
        </ProCard>
      </PageContainer>
    </div>
  );
}
