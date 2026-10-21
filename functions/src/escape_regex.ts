/**
 * 转义正则表达式特殊字符
 * 防止用户输入被当作正则元字符，避免 ReDoS 攻击和搜索错误
 */
export const escapeRegex = (str: string): string => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  // 转义正则表达式中的特殊字符
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
