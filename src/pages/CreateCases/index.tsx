import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { message } from 'antd';
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { createCase, Cases } from '@/services/cases';

export default function CreateCasePage() {
  const handleSubmit = async (value: Cases) => {
    await createCase(value);
    message.success('新建成功，等待审批中');
  };
  const numReg = /^[0-9]*$/;
  return (
    <div>
      <PageContainer>
        <ProCard>
          <ProForm
            onFinish={async (values) => {
              handleSubmit(values as Cases);
            }}
          >
            <ProFormText
              name="title"
              label="案件名"
              rules={[
                {
                  required: true,
                  message: '请输入案件名',
                },
              ]}
              placeholder="请输入案件名"
              width="md"
            />
            {/* TODO: 输入数字的时候显示单位 */}
            <ProForm.Group>
              <ProFormText
                name="amount"
                label="案件涉及金额"
                placeholder="请输入案件涉及的金额大小"
                width="md"
                rules={[
                  {
                    required: true,
                    message: '请输入涉案金额',
                  },
                  {
                    pattern: numReg,
                    message: '请输入纯数字的金额',
                  },
                ]}
              />
              <ProFormText
                name="toll"
                label="预收费金额"
                rules={[
                  {
                    required: true,
                    message: '请输入收费金额',
                  },
                  {
                    pattern: numReg,
                    message: '请输入纯数字的金额',
                  },
                ]}
                placeholder="请输入预计收费金额，大约为涉案金额的 3%"
                width="md"
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormText
                name="litigant"
                label="当事人（公司）"
                placeholder="请输入当事人或公司名字"
                width="md"
                rules={[
                  {
                    required: true,
                    message: '请输入当事人',
                  },
                ]}
              />
              <ProFormText
                name="Defendant"
                label="被告人（公司）"
                rules={[
                  {
                    required: true,
                    message: '请输入被告人或公司名字',
                  },
                ]}
                placeholder="请输入被告人或公司名字"
                width="md"
              />
            </ProForm.Group>
            <ProFormTextArea
              name="description"
              label="案件描述"
              placeholder="可以输入案件描述"
            />
          </ProForm>
        </ProCard>
      </PageContainer>
    </div>
  );
}
