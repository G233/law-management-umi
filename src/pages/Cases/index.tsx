import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ApprovingCases from '@/components/Case/approvingCases';
import ApprovedCases from '@/components/Case/approvedCases';

export default function CasesPage() {
  enum CaseListType {
    approving = 'approving', //已审批
    approved = 'approved', // 待审批
  }
  const [tab, setTab] = useState<CaseListType>(CaseListType.approving);

  return (
    <div>
      <PageContainer>
        <ProCard
          tabs={{
            tabPosition: 'top',
            activeKey: tab,
            onChange: (key) => {
              setTab(key as CaseListType);
            },
          }}
        >
          <ProCard.TabPane key={CaseListType.approving} tab="待审批案件">
            <ApprovingCases />
          </ProCard.TabPane>
          <ProCard.TabPane key={CaseListType.approved} tab="已审批案件">
            <ApprovedCases />
          </ProCard.TabPane>
        </ProCard>
      </PageContainer>
    </div>
  );
}
