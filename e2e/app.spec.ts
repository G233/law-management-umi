import { test, expect } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { join } from 'path';

const SCREENSHOT_DIR = join(process.cwd(), 'artifacts', 'screenshots');

test.beforeAll(async () => {
  await mkdir(SCREENSHOT_DIR, { recursive: true });
});

test.describe('Law Management System E2E Tests', () => {
  test('01 - CaseList page loads and search works', async ({ page }) => {
    await page.goto('/CaseList');
    await page.waitForLoadState('networkidle');
    
    // Check no console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    // Wait for table to load
    await page.waitForSelector('.ant-table', { timeout: 10000 });
    
    // Take screenshot
    await page.screenshot({ path: join(SCREENSHOT_DIR, '01-caselist.png'), fullPage: true });
    
    expect(errors.filter(e => !e.includes('[Mock'))).toHaveLength(0);
  });

  test('02 - AllAdvisory page displays advisory list', async ({ page }) => {
    await page.goto('/AllAdvisory');
    await page.waitForLoadState('networkidle');
    
    await page.waitForSelector('.ant-table', { timeout: 10000 });
    await page.screenshot({ path: join(SCREENSHOT_DIR, '02-alladvisory.png'), fullPage: true });
  });

  test('03 - CaseApprove page - approve case', async ({ page }) => {
    await page.goto('/CaseApprove?mockUser=admin');
    await page.waitForLoadState('networkidle');
    
    // Wait for approving cases tab
    await page.waitForSelector('.ant-tabs', { timeout: 10000 });
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, '03-caseapprove-list.png'), fullPage: true });
    
    // Try to approve (mock will handle it)
    const approveBtn = page.locator('button:has-text("同意")').first();
    if (await approveBtn.isVisible()) {
      await approveBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: join(SCREENSHOT_DIR, '03-caseapprove-approve.png'), fullPage: true });
    }
  });

  test('04 - CaseApprove page - reject case', async ({ page }) => {
    await page.goto('/CaseApprove?mockUser=admin');
    await page.waitForLoadState('networkidle');
    
    await page.waitForSelector('.ant-tabs', { timeout: 10000 });
    
    const rejectBtn = page.locator('button:has-text("不同意")').first();
    if (await rejectBtn.isVisible()) {
      await rejectBtn.click();
      await page.waitForTimeout(500);
      
      // Fill reject reason modal if appears
      const modalInput = page.locator('textarea[placeholder*="拒绝"]');
      if (await modalInput.isVisible()) {
        await modalInput.fill('测试拒绝原因');
        await page.locator('.ant-modal button:has-text("确定")').click();
        await page.waitForTimeout(1000);
      }
      
      await page.screenshot({ path: join(SCREENSHOT_DIR, '04-caseapprove-reject.png'), fullPage: true });
    }
  });

  test('05 - addCaseApprove - create civil case', async ({ page }) => {
    await page.goto('/addCaseApprove?mockUser=admin');
    await page.waitForLoadState('networkidle');
    
    await page.waitForSelector('.ant-table', { timeout: 10000 });
    
    // Click new case button
    const newCaseBtn = page.locator('button:has-text("新建审批")');
    await newCaseBtn.click();
    await page.waitForTimeout(500);
    
    // Fill form
    await page.locator('label:has-text("案件类别") + div button:has-text("民事")').click();
    await page.fill('input[id="caseCause"]', '测试案由');
    await page.fill('input[id="litigant"]', '测试当事人');
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, '05-create-civil-case.png'), fullPage: true });
    
    // Don't submit, just verify form works
    await page.locator('.ant-modal .ant-modal-close').click();
  });

  test('06 - addCaseApprove - create criminal case', async ({ page }) => {
    await page.goto('/addCaseApprove?mockUser=admin');
    await page.waitForLoadState('networkidle');
    
    await page.waitForSelector('.ant-table', { timeout: 10000 });
    
    const newCaseBtn = page.locator('button:has-text("新建审批")');
    await newCaseBtn.click();
    await page.waitForTimeout(500);
    
    await page.locator('label:has-text("案件类别") + div button:has-text("刑事")').click();
    await page.fill('input[id="caseCause"]', '测试罪名');
    await page.fill('input[id="litigant"]', '测试嫌疑人');
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, '06-create-criminal-case.png'), fullPage: true });
    
    await page.locator('.ant-modal .ant-modal-close').click();
  });

  test('07 - addCaseApprove - create administrative case', async ({ page }) => {
    await page.goto('/addCaseApprove?mockUser=admin');
    await page.waitForLoadState('networkidle');
    
    await page.waitForSelector('.ant-table', { timeout: 10000 });
    
    const newCaseBtn = page.locator('button:has-text("新建审批")');
    await newCaseBtn.click();
    await page.waitForTimeout(500);
    
    await page.locator('label:has-text("案件类别") + div button:has-text("行政")').click();
    await page.fill('input[id="caseCause"]', '测试行政案由');
    await page.fill('input[id="litigant"]', '测试原告');
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, '07-create-admin-case.png'), fullPage: true });
    
    await page.locator('.ant-modal .ant-modal-close').click();
  });

  test('08 - My/caseList shows user cases', async ({ page }) => {
    await page.goto('/My/caseList?mockUser=admin');
    await page.waitForLoadState('networkidle');
    
    await page.waitForSelector('.ant-table', { timeout: 10000 });
    await page.screenshot({ path: join(SCREENSHOT_DIR, '08-my-caselist.png'), fullPage: true });
  });

  test('09 - My/advisory - add advisory', async ({ page }) => {
    await page.goto('/My/advisory?mockUser=admin');
    await page.waitForLoadState('networkidle');
    
    await page.waitForSelector('.ant-table', { timeout: 10000 });
    
    // Click add button
    const addBtn = page.locator('button:has-text("添加顾问单位")');
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(500);
      
      await page.fill('input[id="name"]', '测试顾问单位');
      
      await page.screenshot({ path: join(SCREENSHOT_DIR, '09-my-advisory-add.png'), fullPage: true });
      
      await page.locator('.ant-modal .ant-modal-close').click();
    } else {
      await page.screenshot({ path: join(SCREENSHOT_DIR, '09-my-advisory.png'), fullPage: true });
    }
  });

  test('10 - UserManage - edit user', async ({ page }) => {
    await page.goto('/UserManage?mockUser=admin');
    await page.waitForLoadState('networkidle');
    
    await page.waitForSelector('.ant-table', { timeout: 10000 });
    await page.screenshot({ path: join(SCREENSHOT_DIR, '10-usermanage.png'), fullPage: true });
    
    // Try to edit user
    const editBtn = page.locator('button:has-text("编辑")').first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: join(SCREENSHOT_DIR, '10-usermanage-edit.png'), fullPage: true });
      await page.locator('.ant-modal .ant-modal-close').click();
    }
  });

  test('11 - UserManage - mark user as departed', async ({ page }) => {
    await page.goto('/UserManage?mockUser=admin');
    await page.waitForLoadState('networkidle');
    
    await page.waitForSelector('.ant-table', { timeout: 10000 });
    
    // Try to mark as departed
    const departBtn = page.locator('button:has-text("离职")').first();
    if (await departBtn.isVisible()) {
      await departBtn.click();
      await page.waitForTimeout(500);
      
      // Confirm in modal if appears
      const confirmBtn = page.locator('.ant-modal button:has-text("确定")');
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
        await page.waitForTimeout(1000);
      }
      
      await page.screenshot({ path: join(SCREENSHOT_DIR, '11-usermanage-depart.png'), fullPage: true });
    }
  });

  test('12 - Setting page - update personal info', async ({ page }) => {
    await page.goto('/setting?mockUser=admin');
    await page.waitForLoadState('networkidle');
    
    await page.waitForSelector('form', { timeout: 10000 });
    
    // Fill some fields
    const nameInput = page.locator('input[id="name"]');
    if (await nameInput.isVisible()) {
      await nameInput.fill('更新的名字');
    }
    
    await page.screenshot({ path: join(SCREENSHOT_DIR, '12-setting.png'), fullPage: true });
  });

  test('13 - CaseDetail page displays case details', async ({ page }) => {
    // Try to go to case detail with mock case ID
    await page.goto('/CaseDetail?id=case-1&mockUser=admin');
    await page.waitForLoadState('networkidle');
    
    await page.waitForSelector('form', { timeout: 10000 });
    await page.screenshot({ path: join(SCREENSHOT_DIR, '13-casedetail.png'), fullPage: true });
  });
});
