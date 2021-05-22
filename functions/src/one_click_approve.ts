import { db, CaseStatus, noticeState, noticeType } from './until';

const dbCase = db.collection('Cases');
const dbNotice = db.collection('Notice');

const approveAgree = async (
  id: string,
  approverId: string,
  approveState: CaseStatus,
  approveMsg: string,
) => {
  await dbCase.doc(id).update({
    approveStatus: approveState,
    approverId,
    approveMsg,
    approveTime: new Date(),
  });
  await addNotice(id, approveState);
  await cleanNotice(id);
};

// 添加审批结果通知
const addNotice = async (caseId: string, approveState: CaseStatus) => {
  const res = await dbCase.doc(caseId).get();
  const resCase = res.data[0];
  const notice = {
    title: '立案审批结果',
    unionId: resCase.undertaker,
    msg:
      approveState === CaseStatus.AGREE
        ? '立案审批已经通过'
        : '立案审批未通过,点击查看原因',
    caseId: caseId,
    state: noticeState.unReade,
    createTime: new Date(),
    type: noticeType.approveResult,
  };
  dbNotice.add(notice);
};

// 清除关联同一个案件的审批通知
const cleanNotice = async (caseId: string) => {
  const res = await dbNotice
    .where({
      type: noticeType.approve,
      caseId: caseId,
    })
    .get();
  res.data.forEach((item) => {
    dbNotice.doc(item._id).update({
      state: noticeState.read,
    });
  });
};

interface requestProp {
  approverId: string;
  idList: string[];
  approveState: CaseStatus;
  approveMsg: string;
}

const oneClickApprove = async ({
  approverId,
  idList,
  approveState,
  approveMsg,
}: requestProp) =>
  await Promise.all(
    idList.map((id) => approveAgree(id, approverId, approveState, approveMsg)),
  );

export { oneClickApprove };
