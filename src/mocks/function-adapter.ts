/**
 * Mock adapter for cloud functions
 * Routes function calls to mock implementations using mock database
 */

import type { MockDatabase } from './cloudbase-mock';

// Import the enums and types from cloud functions
export enum CaseStatus {
  AGREE,
  WAITING,
  REJECT,
}

export enum CaseType {
  Civil,
  Criminal,
  Administrative,
}

export enum noticeType {
  approve = 'approve',
  approveResult = 'approveResult',
  msg = 'msg',
}

export enum noticeState {
  unReade,
  read,
}

const CaseIdCacheId = '28ee4e3e605adc2d08064d5d28764c11';
const CaseCauseId = '28ee4e3e605adc2e0c514fe90a97ea26';

const caseIdText = {
  [CaseType.Civil]: '民代',
  [CaseType.Criminal]: '刑辩',
  [CaseType.Administrative]: '行代',
};

/**
 * Generate atomic case ID
 */
async function generateCaseId(db: any, caseType: CaseType): Promise<string> {
  const year = new Date().getFullYear();
  const cacheCol = db.collection('Cache');
  const res = await cacheCol.where({ _id: CaseIdCacheId }).get();
  const cache = res.data[0];

  let caseIdNum: number;

  if (!cache || !cache[year]) {
    const initData: any = {
      _id: CaseIdCacheId,
      [year]: {
        [CaseType.Civil]: caseType === CaseType.Civil ? 1 : 0,
        [CaseType.Criminal]: caseType === CaseType.Criminal ? 1 : 0,
        [CaseType.Administrative]: caseType === CaseType.Administrative ? 1 : 0,
      },
    };
    await cacheCol.doc(CaseIdCacheId).set(initData);
    caseIdNum = 1;
  } else {
    caseIdNum = (cache[year]?.[caseType] || 0) + 1;
    cache[year] = cache[year] || {};
    cache[year][caseType] = caseIdNum;
    await cacheCol.doc(CaseIdCacheId).update(cache);
  }

  return `（${year}）河清${caseIdText[caseType]} ${caseIdNum} 号`;
}

/**
 * Create case
 */
async function createCase(db: any, data: any, context: any) {
  const { undertaker, caseCause, caseDetail, caseType, caseIntro } = data;

  // Generate case ID
  const caseId = await generateCaseId(db, caseType);

  // Create case record
  const { v4: uuidv4 } = await import('uuid');
  const newCase = {
    _id: uuidv4(),
    undertaker,
    caseCause,
    caseDetail: caseDetail || '',
    caseIntro: caseIntro || '',
    caseType,
    caseId,
    caseStatus: CaseStatus.WAITING,
    createTime: Date.now(),
  };

  await db.collection('Cases').add(newCase);

  // Add approval notices for admin users
  const adminUsers = await db.collection('User').where({ role: 'admin' }).get();
  const notices = adminUsers.data
    .filter((user: any) => user.unionId !== undertaker)
    .map((user: any) => ({
      _id: uuidv4(),
      title: '审批通知',
      content: `${data.undertakerName}发起了案件的审批`,
      createTime: Date.now(),
      clickUrl: `/case/detail/${newCase._id}`,
      extra: newCase._id,
      read: noticeState.unReade,
      unionId: user.unionId,
      type: noticeType.approve,
    }));

  for (const notice of notices) {
    await db.collection('Notice').add(notice);
  }

  // Update case cause cache
  const cacheRes = await db.collection('Cache').where({ _id: CaseCauseId }).get();
  const caseCache = cacheRes.data[0];
  if (caseCache && !caseCache.caseCauseList?.includes(caseCause)) {
    caseCache.caseCauseList = [...(caseCache.caseCauseList || []), caseCause];
    await db.collection('Cache').doc(CaseCauseId).update(caseCache);
  }

  return { success: true, data: newCase };
}

/**
 * Approve case
 */
async function oneClickApprove(db: any, data: any, context: any) {
  const { caseId, caseStatus, approveDetail } = data;

  // Update case status
  const caseRes = await db.collection('Cases').where({ _id: caseId }).get();
  const caseRecord = caseRes.data[0];
  
  if (!caseRecord) {
    return { error: true, message: '案件不存在' };
  }

  caseRecord.caseStatus = caseStatus;
  caseRecord.approveDetail = approveDetail || '';
  caseRecord.approveTime = Date.now();
  caseRecord.approverId = context.TCB_UNIONID;

  await db.collection('Cases').doc(caseId).update(caseRecord);

  // Send approval result notice to case creator
  const { v4: uuidv4 } = await import('uuid');
  const notice = {
    _id: uuidv4(),
    title: '审批结果',
    content: caseStatus === CaseStatus.AGREE ? '您的案件已通过审批' : '您的案件未通过审批',
    createTime: Date.now(),
    clickUrl: `/case/detail/${caseId}`,
    extra: caseId,
    read: noticeState.unReade,
    unionId: caseRecord.undertaker,
    type: noticeType.approveResult,
  };

  await db.collection('Notice').add(notice);

  return { success: true };
}

/**
 * Change/update case
 */
async function changeCase(db: any, data: any, context: any) {
  const { caseId, updates } = data;

  const caseRes = await db.collection('Cases').where({ _id: caseId }).get();
  const caseRecord = caseRes.data[0];

  if (!caseRecord) {
    return { error: true, message: '案件不存在' };
  }

  // Don't overwrite createTime
  const { createTime, ...rest } = updates;
  Object.assign(caseRecord, rest);

  await db.collection('Cases').doc(caseId).update(caseRecord);

  return { success: true, data: caseRecord };
}

/**
 * Get case list
 */
async function getCaseList(db: any, data: any, _context: any) {
  const {
    current = 1,
    pageSize = 10,
    condition,
    caseCause,
    litigant,
    caseId,
    CaseType,
  } = data || {};

  const result = await db.collection('Cases').get();
  let rows = result.data || [];

  if (condition && typeof condition === 'object') {
    if (condition.approveStatus !== undefined) {
      rows = rows.filter((item: any) => item.approveStatus === condition.approveStatus);
    }
    if (condition.unionId) {
      rows = rows.filter((item: any) => item.unionId === condition.unionId);
    }
  }
  if (caseCause) {
    rows = rows.filter((item: any) => String(item.caseCause || '').includes(String(caseCause)));
  }
  if (litigant) {
    rows = rows.filter((item: any) => String(item.litigant || '').includes(String(litigant)));
  }
  if (caseId) {
    rows = rows.filter((item: any) => String(item.caseId || '').includes(String(caseId)));
  }
  if (CaseType !== undefined && CaseType !== null && CaseType !== '') {
    rows = rows.filter((item: any) => Number(item.CaseType) === Number(CaseType));
  }

  const start = (Number(current) - 1) * Number(pageSize);
  return {
    caseList: rows.slice(start, start + Number(pageSize)),
    count: rows.length,
  };
}

/**
 * Fetch all advisory records
 */
async function fetchAllAdvisory(db: any, data: any, context: any) {
  const result = await db.collection('Advisory').orderBy('createTime', 'desc').get();
  return { success: true, data: result.data };
}

/**
 * Fetch all users
 */
async function fetchAllUser(db: any, data: any, context: any) {
  const result = await db.collection('User').get();
  return { success: true, data: result.data };
}

/**
 * Update user info
 */
async function updateUserInfo(db: any, data: any, context: any) {
  const { unionId, updates } = data;

  const userRes = await db.collection('User').where({ unionId }).get();
  const user = userRes.data[0];

  if (!user) {
    return { error: true, message: '用户不存在' };
  }

  Object.assign(user, updates);
  await db.collection('User').doc(user._id).update(user);

  return { success: true, data: user };
}

/**
 * WeChat login (mock)
 */
async function wxLogin(db: any, data: any, context: any) {
  return { success: true, message: 'Mock login' };
}

/**
 * Main entry point for cloud function execution in mock mode
 */
export async function executeMockFunction(
  db: any,
  fnName: string,
  data: any,
  context: any,
) {
  const handlers: Record<string, (db: any, data: any, context: any) => Promise<any>> = {
    create_case: createCase,
    one_click_approve: oneClickApprove,
    change_case: changeCase,
    get_case_list: getCaseList,
    fetch_all_advisory: fetchAllAdvisory,
    fetch_all_user: fetchAllUser,
    update_user_info: updateUserInfo,
    wx_login: wxLogin,
    generate_case_id: async (db: any, data: any) => {
      const caseId = await generateCaseId(db, data.caseType);
      return { success: true, caseId };
    },
  };

  const handler = handlers[fnName];
  if (!handler) {
    throw new Error(`Unknown function: ${fnName}`);
  }

  return await handler(db, data, context);
}
