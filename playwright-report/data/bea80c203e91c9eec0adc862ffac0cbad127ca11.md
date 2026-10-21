# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Law Management System E2E Tests >> 09 - My/advisory - add advisory
- Location: e2e/app.spec.ts:148:7

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('.ant-table') to be visible

```

# Page snapshot

```yaml
- iframe [ref=e3]:
  - generic [ref=f1e3]:
    - generic "Click or press Escape to dismiss." [ref=f1e4] [cursor=pointer]: ×
    - generic [ref=f1e5]:
      - generic [ref=f1e6]: "Unhandled Rejection (TypeError): app.auth is not a function"
      - generic [ref=f1e7]:
        - generic [ref=f1e8]:
          - generic [ref=f1e9]: (anonymous function)
          - generic [ref=f1e10]: .law-management-umi/src/cloud_function.ts:20
          - generic [ref=f1e11]:
            - code [ref=f1e14]:
              - generic [ref=f1e15]: 17 |
              - generic [ref=f1e16]: 18 | export const cloudApp = app;
              - generic [ref=f1e17]: 19 | export const db = app.database();
              - generic [ref=f1e18]: "> 20 | export const auth = app.auth({ persistence: 'local' });"
              - generic [ref=f1e19]: 21 | export const _ = isMockMode()
              - generic [ref=f1e20]: 22 | ? (await import('./mocks/cloudbase-mock')).mockCommand
              - generic [ref=f1e21]: "23 | : db.command;"
            - button "View compiled" [ref=f1e22] [cursor=pointer]
        - button "▶ 3 stack frames were collapsed." [ref=f1e24] [cursor=pointer]
        - generic [ref=f1e25]:
          - generic [ref=f1e26]: __webpack_require__
          - generic [ref=f1e27]: .law-management-umi/webpack/bootstrap:30
          - generic [ref=f1e28]:
            - code [ref=f1e31]:
              - generic [ref=f1e32]: 27 | throw e;
              - generic [ref=f1e33]: "28 | }"
              - generic [ref=f1e34]: 29 | module = execOptions.module;
              - generic [ref=f1e35]: "> 30 | execOptions.factory.call(module.exports, module, module.exports, execOptions.require);"
              - generic [ref=f1e36]: "| ^"
              - generic [ref=f1e37]: "31 | } catch(e) {"
              - generic [ref=f1e38]: 32 | module.error = e;
              - generic [ref=f1e39]: 33 | throw e;
            - button "View compiled" [ref=f1e40] [cursor=pointer]
        - button "▶ 5 stack frames were collapsed." [ref=f1e42] [cursor=pointer]
        - generic [ref=f1e43]:
          - generic [ref=f1e44]: __webpack_require__
          - generic [ref=f1e45]: .law-management-umi/webpack/bootstrap:30
          - generic [ref=f1e46]:
            - code [ref=f1e49]:
              - generic [ref=f1e50]: 27 | throw e;
              - generic [ref=f1e51]: "28 | }"
              - generic [ref=f1e52]: 29 | module = execOptions.module;
              - generic [ref=f1e53]: "> 30 | execOptions.factory.call(module.exports, module, module.exports, execOptions.require);"
              - generic [ref=f1e54]: "| ^"
              - generic [ref=f1e55]: "31 | } catch(e) {"
              - generic [ref=f1e56]: 32 | module.error = e;
              - generic [ref=f1e57]: 33 | throw e;
            - button "View compiled" [ref=f1e58] [cursor=pointer]
        - button "▶ 5 stack frames were collapsed." [ref=f1e60] [cursor=pointer]
        - generic [ref=f1e61]:
          - generic [ref=f1e62]: __webpack_require__
          - generic [ref=f1e63]: .law-management-umi/webpack/bootstrap:30
          - generic [ref=f1e64]:
            - code [ref=f1e67]:
              - generic [ref=f1e68]: 27 | throw e;
              - generic [ref=f1e69]: "28 | }"
              - generic [ref=f1e70]: 29 | module = execOptions.module;
              - generic [ref=f1e71]: "> 30 | execOptions.factory.call(module.exports, module, module.exports, execOptions.require);"
              - generic [ref=f1e72]: "| ^"
              - generic [ref=f1e73]: "31 | } catch(e) {"
              - generic [ref=f1e74]: 32 | module.error = e;
              - generic [ref=f1e75]: 33 | throw e;
            - button "View compiled" [ref=f1e76] [cursor=pointer]
        - button "▶ 5 stack frames were collapsed." [ref=f1e78] [cursor=pointer]
        - generic [ref=f1e79]:
          - generic [ref=f1e80]: __webpack_require__
          - generic [ref=f1e81]: .law-management-umi/webpack/bootstrap:30
          - generic [ref=f1e82]:
            - code [ref=f1e85]:
              - generic [ref=f1e86]: 27 | throw e;
              - generic [ref=f1e87]: "28 | }"
              - generic [ref=f1e88]: 29 | module = execOptions.module;
              - generic [ref=f1e89]: "> 30 | execOptions.factory.call(module.exports, module, module.exports, execOptions.require);"
              - generic [ref=f1e90]: "| ^"
              - generic [ref=f1e91]: "31 | } catch(e) {"
              - generic [ref=f1e92]: 32 | module.error = e;
              - generic [ref=f1e93]: 33 | throw e;
            - button "View compiled" [ref=f1e94] [cursor=pointer]
        - button "▶ 5 stack frames were collapsed." [ref=f1e96] [cursor=pointer]
        - generic [ref=f1e97]:
          - generic [ref=f1e98]: __webpack_require__
          - generic [ref=f1e99]: .law-management-umi/webpack/bootstrap:30
          - generic [ref=f1e100]:
            - code [ref=f1e103]:
              - generic [ref=f1e104]: 27 | throw e;
              - generic [ref=f1e105]: "28 | }"
              - generic [ref=f1e106]: 29 | module = execOptions.module;
              - generic [ref=f1e107]: "> 30 | execOptions.factory.call(module.exports, module, module.exports, execOptions.require);"
              - generic [ref=f1e108]: "| ^"
              - generic [ref=f1e109]: "31 | } catch(e) {"
              - generic [ref=f1e110]: 32 | module.error = e;
              - generic [ref=f1e111]: 33 | throw e;
            - button "View compiled" [ref=f1e112] [cursor=pointer]
        - button "▶ 5 stack frames were collapsed." [ref=f1e114] [cursor=pointer]
        - generic [ref=f1e115]:
          - generic [ref=f1e116]: __webpack_require__
          - generic [ref=f1e117]: .law-management-umi/webpack/bootstrap:30
          - generic [ref=f1e118]:
            - code [ref=f1e121]:
              - generic [ref=f1e122]: 27 | throw e;
              - generic [ref=f1e123]: "28 | }"
              - generic [ref=f1e124]: 29 | module = execOptions.module;
              - generic [ref=f1e125]: "> 30 | execOptions.factory.call(module.exports, module, module.exports, execOptions.require);"
              - generic [ref=f1e126]: "| ^"
              - generic [ref=f1e127]: "31 | } catch(e) {"
              - generic [ref=f1e128]: 32 | module.error = e;
              - generic [ref=f1e129]: 33 | throw e;
            - button "View compiled" [ref=f1e130] [cursor=pointer]
        - button "▶ 5 stack frames were collapsed." [ref=f1e132] [cursor=pointer]
        - generic [ref=f1e133]:
          - generic [ref=f1e134]: __webpack_require__
          - generic [ref=f1e135]: .law-management-umi/webpack/bootstrap:30
          - generic [ref=f1e136]:
            - code [ref=f1e139]:
              - generic [ref=f1e140]: 27 | throw e;
              - generic [ref=f1e141]: "28 | }"
              - generic [ref=f1e142]: 29 | module = execOptions.module;
              - generic [ref=f1e143]: "> 30 | execOptions.factory.call(module.exports, module, module.exports, execOptions.require);"
              - generic [ref=f1e144]: "| ^"
              - generic [ref=f1e145]: "31 | } catch(e) {"
              - generic [ref=f1e146]: 32 | module.error = e;
              - generic [ref=f1e147]: 33 | throw e;
            - button "View compiled" [ref=f1e148] [cursor=pointer]
        - generic [ref=f1e149]:
          - generic [ref=f1e150]: fn
          - generic [ref=f1e151]: webpack:/law-management-umi/webpack/runtime/hot module replacement:61
        - generic [ref=f1e152]:
          - generic [ref=f1e153]: async
          - generic [ref=f1e154]: .law-management-umi/mfsu-virtual-entry/umi.js:2
          - generic [ref=f1e155]:
            - code [ref=f1e158]:
              - generic [ref=f1e159]: 1 | await import('/workspace/node_modules/.pnpm/@umijs+bundler-webpack@4.7.25_type-fest@0.20.2_typescript@5.9.3_webpack@5.112.0_esbuild_af38a29e3d1f562f76889e503eb94217/node_modules/@umijs/bundler-webpack/client/client/client.js');
              - generic [ref=f1e160]: "> 2 | await import('/workspace/src/.umi/umi.ts');"
              - generic [ref=f1e161]: 3 | export default 1;
            - button "View compiled" [ref=f1e162] [cursor=pointer]
    - generic [ref=f1e163]: This screen is visible only in development. It will not appear if the app crashes in production.Open your browser’s developer console to further inspect this error. Click the 'X' or hit ESC to dismiss this message.
```

# Test source

```ts
  52  |       await page.waitForTimeout(1000);
  53  |       await page.screenshot({ path: join(SCREENSHOT_DIR, '03-caseapprove-approve.png'), fullPage: true });
  54  |     }
  55  |   });
  56  | 
  57  |   test('04 - CaseApprove page - reject case', async ({ page }) => {
  58  |     await page.goto('/CaseApprove?mockUser=admin');
  59  |     await page.waitForLoadState('networkidle');
  60  |     
  61  |     await page.waitForSelector('.ant-tabs', { timeout: 10000 });
  62  |     
  63  |     const rejectBtn = page.locator('button:has-text("不同意")').first();
  64  |     if (await rejectBtn.isVisible()) {
  65  |       await rejectBtn.click();
  66  |       await page.waitForTimeout(500);
  67  |       
  68  |       // Fill reject reason modal if appears
  69  |       const modalInput = page.locator('textarea[placeholder*="拒绝"]');
  70  |       if (await modalInput.isVisible()) {
  71  |         await modalInput.fill('测试拒绝原因');
  72  |         await page.locator('.ant-modal button:has-text("确定")').click();
  73  |         await page.waitForTimeout(1000);
  74  |       }
  75  |       
  76  |       await page.screenshot({ path: join(SCREENSHOT_DIR, '04-caseapprove-reject.png'), fullPage: true });
  77  |     }
  78  |   });
  79  | 
  80  |   test('05 - addCaseApprove - create civil case', async ({ page }) => {
  81  |     await page.goto('/addCaseApprove?mockUser=admin');
  82  |     await page.waitForLoadState('networkidle');
  83  |     
  84  |     await page.waitForSelector('.ant-table', { timeout: 10000 });
  85  |     
  86  |     // Click new case button
  87  |     const newCaseBtn = page.locator('button:has-text("新建审批")');
  88  |     await newCaseBtn.click();
  89  |     await page.waitForTimeout(500);
  90  |     
  91  |     // Fill form
  92  |     await page.locator('label:has-text("案件类别") + div button:has-text("民事")').click();
  93  |     await page.fill('input[id="caseCause"]', '测试案由');
  94  |     await page.fill('input[id="litigant"]', '测试当事人');
  95  |     
  96  |     await page.screenshot({ path: join(SCREENSHOT_DIR, '05-create-civil-case.png'), fullPage: true });
  97  |     
  98  |     // Don't submit, just verify form works
  99  |     await page.locator('.ant-modal .ant-modal-close').click();
  100 |   });
  101 | 
  102 |   test('06 - addCaseApprove - create criminal case', async ({ page }) => {
  103 |     await page.goto('/addCaseApprove?mockUser=admin');
  104 |     await page.waitForLoadState('networkidle');
  105 |     
  106 |     await page.waitForSelector('.ant-table', { timeout: 10000 });
  107 |     
  108 |     const newCaseBtn = page.locator('button:has-text("新建审批")');
  109 |     await newCaseBtn.click();
  110 |     await page.waitForTimeout(500);
  111 |     
  112 |     await page.locator('label:has-text("案件类别") + div button:has-text("刑事")').click();
  113 |     await page.fill('input[id="caseCause"]', '测试罪名');
  114 |     await page.fill('input[id="litigant"]', '测试嫌疑人');
  115 |     
  116 |     await page.screenshot({ path: join(SCREENSHOT_DIR, '06-create-criminal-case.png'), fullPage: true });
  117 |     
  118 |     await page.locator('.ant-modal .ant-modal-close').click();
  119 |   });
  120 | 
  121 |   test('07 - addCaseApprove - create administrative case', async ({ page }) => {
  122 |     await page.goto('/addCaseApprove?mockUser=admin');
  123 |     await page.waitForLoadState('networkidle');
  124 |     
  125 |     await page.waitForSelector('.ant-table', { timeout: 10000 });
  126 |     
  127 |     const newCaseBtn = page.locator('button:has-text("新建审批")');
  128 |     await newCaseBtn.click();
  129 |     await page.waitForTimeout(500);
  130 |     
  131 |     await page.locator('label:has-text("案件类别") + div button:has-text("行政")').click();
  132 |     await page.fill('input[id="caseCause"]', '测试行政案由');
  133 |     await page.fill('input[id="litigant"]', '测试原告');
  134 |     
  135 |     await page.screenshot({ path: join(SCREENSHOT_DIR, '07-create-admin-case.png'), fullPage: true });
  136 |     
  137 |     await page.locator('.ant-modal .ant-modal-close').click();
  138 |   });
  139 | 
  140 |   test('08 - My/caseList shows user cases', async ({ page }) => {
  141 |     await page.goto('/My/caseList?mockUser=admin');
  142 |     await page.waitForLoadState('networkidle');
  143 |     
  144 |     await page.waitForSelector('.ant-table', { timeout: 10000 });
  145 |     await page.screenshot({ path: join(SCREENSHOT_DIR, '08-my-caselist.png'), fullPage: true });
  146 |   });
  147 | 
  148 |   test('09 - My/advisory - add advisory', async ({ page }) => {
  149 |     await page.goto('/My/advisory?mockUser=admin');
  150 |     await page.waitForLoadState('networkidle');
  151 |     
> 152 |     await page.waitForSelector('.ant-table', { timeout: 10000 });
      |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  153 |     
  154 |     // Click add button
  155 |     const addBtn = page.locator('button:has-text("添加顾问单位")');
  156 |     if (await addBtn.isVisible()) {
  157 |       await addBtn.click();
  158 |       await page.waitForTimeout(500);
  159 |       
  160 |       await page.fill('input[id="name"]', '测试顾问单位');
  161 |       
  162 |       await page.screenshot({ path: join(SCREENSHOT_DIR, '09-my-advisory-add.png'), fullPage: true });
  163 |       
  164 |       await page.locator('.ant-modal .ant-modal-close').click();
  165 |     } else {
  166 |       await page.screenshot({ path: join(SCREENSHOT_DIR, '09-my-advisory.png'), fullPage: true });
  167 |     }
  168 |   });
  169 | 
  170 |   test('10 - UserManage - edit user', async ({ page }) => {
  171 |     await page.goto('/UserManage?mockUser=admin');
  172 |     await page.waitForLoadState('networkidle');
  173 |     
  174 |     await page.waitForSelector('.ant-table', { timeout: 10000 });
  175 |     await page.screenshot({ path: join(SCREENSHOT_DIR, '10-usermanage.png'), fullPage: true });
  176 |     
  177 |     // Try to edit user
  178 |     const editBtn = page.locator('button:has-text("编辑")').first();
  179 |     if (await editBtn.isVisible()) {
  180 |       await editBtn.click();
  181 |       await page.waitForTimeout(500);
  182 |       await page.screenshot({ path: join(SCREENSHOT_DIR, '10-usermanage-edit.png'), fullPage: true });
  183 |       await page.locator('.ant-modal .ant-modal-close').click();
  184 |     }
  185 |   });
  186 | 
  187 |   test('11 - UserManage - mark user as departed', async ({ page }) => {
  188 |     await page.goto('/UserManage?mockUser=admin');
  189 |     await page.waitForLoadState('networkidle');
  190 |     
  191 |     await page.waitForSelector('.ant-table', { timeout: 10000 });
  192 |     
  193 |     // Try to mark as departed
  194 |     const departBtn = page.locator('button:has-text("离职")').first();
  195 |     if (await departBtn.isVisible()) {
  196 |       await departBtn.click();
  197 |       await page.waitForTimeout(500);
  198 |       
  199 |       // Confirm in modal if appears
  200 |       const confirmBtn = page.locator('.ant-modal button:has-text("确定")');
  201 |       if (await confirmBtn.isVisible()) {
  202 |         await confirmBtn.click();
  203 |         await page.waitForTimeout(1000);
  204 |       }
  205 |       
  206 |       await page.screenshot({ path: join(SCREENSHOT_DIR, '11-usermanage-depart.png'), fullPage: true });
  207 |     }
  208 |   });
  209 | 
  210 |   test('12 - Setting page - update personal info', async ({ page }) => {
  211 |     await page.goto('/setting?mockUser=admin');
  212 |     await page.waitForLoadState('networkidle');
  213 |     
  214 |     await page.waitForSelector('form', { timeout: 10000 });
  215 |     
  216 |     // Fill some fields
  217 |     const nameInput = page.locator('input[id="name"]');
  218 |     if (await nameInput.isVisible()) {
  219 |       await nameInput.fill('更新的名字');
  220 |     }
  221 |     
  222 |     await page.screenshot({ path: join(SCREENSHOT_DIR, '12-setting.png'), fullPage: true });
  223 |   });
  224 | 
  225 |   test('13 - CaseDetail page displays case details', async ({ page }) => {
  226 |     // Try to go to case detail with mock case ID
  227 |     await page.goto('/CaseDetail?id=case-1&mockUser=admin');
  228 |     await page.waitForLoadState('networkidle');
  229 |     
  230 |     await page.waitForSelector('form', { timeout: 10000 });
  231 |     await page.screenshot({ path: join(SCREENSHOT_DIR, '13-casedetail.png'), fullPage: true });
  232 |   });
  233 | });
  234 | 
```