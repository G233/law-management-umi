import { db, CaseType, _ } from './until';

const CaseIdCacheId = '28ee4e3e605adc2d08064d5d28764c11';

const caseIdText = {
  [CaseType.Civil]: '民代',
  [CaseType.Criminal]: '刑辩',
  [CaseType.Administrative]: '行代',
};

/**
 * 在云函数中原子生成案号
 * 使用 inc 操作保证原子性，避免并发时案号重复
 */
export const generateCaseId = async (caseType: CaseType): Promise<string> => {
  const year = new Date().getFullYear();
  const cacheDoc = db.collection('Cache').doc(CaseIdCacheId);
  
  // 获取当前缓存
  const res = await cacheDoc.get();
  const cache = res.data[0];
  
  let caseIdNum: number;
  
  // 当年还没有案号数据，初始化
  if (!cache || !cache[year]) {
    const initData = {
      [year]: {
        [CaseType.Civil]: caseType === CaseType.Civil ? 1 : 0,
        [CaseType.Criminal]: caseType === CaseType.Criminal ? 1 : 0,
        [CaseType.Administrative]: caseType === CaseType.Administrative ? 1 : 0,
      },
    };
    await cacheDoc.update(initData);
    caseIdNum = 1;
  } else {
    // 使用原子递增操作
    caseIdNum = cache[year][caseType] + 1;
    await cacheDoc.update({
      [`${year}.${caseType}`]: _.inc(1),
    });
  }
  
  return `（${year}）河清${caseIdText[caseType]} ${caseIdNum} 号`;
};
