import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import MyCaseList from '@/pages/My/caseList';
import MyCases from '@/pages/My/approveCase';
import Advisory from '@/pages/My/advisory';

export default function CasesPage() {
  enum CaseListType {
    caseList = 'caseList', // 我的所有案件
    approveCase = 'approveCase', //我的案件审批状态
    advisory = 'advisory', //法律顾问单位
  }
  const [tab, setTab] = useState<CaseListType>(CaseListType.caseList);
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
          <ProCard.TabPane key={CaseListType.caseList} tab="所有案件">
            <MyCaseList />
          </ProCard.TabPane>
          <ProCard.TabPane key={CaseListType.approveCase} tab="审批案件">
            <MyCases />
          </ProCard.TabPane>
          <ProCard.TabPane key={CaseListType.advisory} tab="法律顾问单位">
            <Advisory />
          </ProCard.TabPane>
        </ProCard>
      </PageContainer>
    </div>
  );
}
