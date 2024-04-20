import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ApprovingCases from '@/pages/CaseApprove/approvingCases';
import ApprovedCases from '@/pages/CaseApprove/approvedCases';
import useSafeState from '@/hook/useSafeState/index';

export default function CaseApprove() {
  enum CaseListType {
    approving = 'approving', //已审批
    approved = 'approved', // 待审批
  }
  const [tab, setTab] = useSafeState<CaseListType>(CaseListType.approving);

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
            items: [
              {
                key: CaseListType.approving,
                label: '待审批案件',
                children: <ApprovingCases />,
                
              },
              {
                key: CaseListType.approved,
                label: '案件审批记录',
                children: <ApprovedCases />,
              },
            ],
          }}
        >
        </ProCard>
      </PageContainer>
    </div>
  );
}
