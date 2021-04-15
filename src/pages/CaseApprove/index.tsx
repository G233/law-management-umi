import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ApprovingCases from '@/pages/CaseApprove/approvingCases';
import ApprovedCases from '@/pages/CaseApprove/approvedCases';

export default function CaseApprove() {
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
          <ProCard.TabPane key={CaseListType.approved} tab="案件审批记录">
            <ApprovedCases />
          </ProCard.TabPane>
        </ProCard>
      </PageContainer>
    </div>
  );
}
