import { describe, it, expect } from 'vitest';
import { escapeRegex } from '../escape_regex';

describe('escapeRegex', () => {
  it('should escape special regex characters', () => {
    expect(escapeRegex('test.case')).toBe('test\\.case');
    expect(escapeRegex('test*case')).toBe('test\\*case');
    expect(escapeRegex('test+case')).toBe('test\\+case');
    expect(escapeRegex('test?case')).toBe('test\\?case');
    expect(escapeRegex('test^case')).toBe('test\\^case');
    expect(escapeRegex('test$case')).toBe('test\\$case');
    expect(escapeRegex('test{case')).toBe('test\\{case');
    expect(escapeRegex('test}case')).toBe('test\\}case');
    expect(escapeRegex('test(case')).toBe('test\\(case');
    expect(escapeRegex('test)case')).toBe('test\\)case');
    expect(escapeRegex('test|case')).toBe('test\\|case');
    expect(escapeRegex('test[case')).toBe('test\\[case');
    expect(escapeRegex('test]case')).toBe('test\\]case');
    expect(escapeRegex('test\\case')).toBe('test\\\\case');
  });

  it('should handle empty string', () => {
    expect(escapeRegex('')).toBe('');
  });

  it('should handle null and undefined', () => {
    expect(escapeRegex(null as any)).toBe('');
    expect(escapeRegex(undefined as any)).toBe('');
  });

  it('should not modify normal strings', () => {
    expect(escapeRegex('normal text')).toBe('normal text');
    expect(escapeRegex('中文测试')).toBe('中文测试');
  });

  it('should escape complex patterns', () => {
    expect(escapeRegex('.*+?^${}()|[]\\'))
      .toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
  });
});
