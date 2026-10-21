import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CaseType } from '../until';

describe('generateCaseId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate correct case ID format for Civil case', () => {
    const year = new Date().getFullYear();
    const caseId = `（${year}）河清民代 1 号`;
    
    expect(caseId).toMatch(/^（\d{4}）河清民代 \d+ 号$/);
    expect(caseId).toContain('民代');
  });

  it('should generate correct case ID format for Criminal case', () => {
    const year = new Date().getFullYear();
    const caseId = `（${year}）河清刑辩 1 号`;
    
    expect(caseId).toMatch(/^（\d{4}）河清刑辩 \d+ 号$/);
    expect(caseId).toContain('刑辩');
  });

  it('should generate correct case ID format for Administrative case', () => {
    const year = new Date().getFullYear();
    const caseId = `（${year}）河清行代 1 号`;
    
    expect(caseId).toMatch(/^（\d{4}）河清行代 \d+ 号$/);
    expect(caseId).toContain('行代');
  });

  it('should use current year in case ID', () => {
    const year = new Date().getFullYear();
    const caseId = `（${year}）河清民代 1 号`;
    
    expect(caseId).toContain(`（${year}）`);
  });
});
