import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
export default function CasesPage(props: any) {
  return (
    <div>
      <PageContainer>
        <ProCard>{props.children}</ProCard>
      </PageContainer>
    </div>
  );
}
