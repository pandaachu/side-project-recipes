import { expect, test } from '@playwright/test';

test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 使用完整的 URL 路徑
    await page.goto('/login'); // 確認這裡的路徑與你的應用路由匹配
    // 等待頁面加載完成
    await page.waitForLoadState('networkidle');
    // 確保登入表單已加載
    await page.waitForSelector('form[id="login"]');
  });
  // 基本頁面載入測試
  test('should load login page and render login form', async ({ page }) => {
    // 確認重要元素存在
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByLabel(/密碼/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /登入/i })).toBeVisible();
  });

  // 表單驗證測試
  test('should show validation errors for empty form submission', async ({ page }) => {
    // 點擊提交按鈕而不填寫表單
    const submitButton = await page.getByRole('button', { name: '登 入' });

    // // 方式 3: 使用 CSS 選擇器
    // const buttonBySelector = page.locator('button[type="submit"]');
    // await expect(buttonBySelector).toBeVisible();

    // // 方式 4: 使用部分文字匹配
    // const buttonByPartialText = page.getByText('登', { exact: false });
    // await expect(buttonByPartialText).toBeVisible();

    // 點擊按鈕
    await submitButton.click();

    // 2. 等待錯誤訊息容器出現
    await page.waitForSelector('.ant-form-item-explain-error');

    // 等待並驗證錯誤訊息
    const emailError = await page.getByText('請輸入您的電子郵件');
    const passwordError = await page.getByText('請輸入您的密碼');

    await expect(emailError).toBeVisible();
    await expect(passwordError).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    // 輸入無效的電子郵件格式
    await page.getByLabel('email').fill('invalid-email');
    await page.getByLabel('密碼').fill('validPassword123');
    await page.click('button[type="submit"]');

    // 驗證錯誤訊息
    await expect(page.getByText('請輸入有效的電子郵件地址')).toBeVisible();
  });

  test('social login buttons are visible', async ({ page }) => {
    // 檢查社交登入按鈕是否存在
    await expect(page.getByText('GitHub')).toBeVisible();
    await expect(page.getByText('Google')).toBeVisible();
    await expect(page.getByText('Line')).toBeVisible();
  });

  // 登入流程測試
  // test('should handle complete login flow', async ({ page }) => {
  //   // 填寫表單
  //   await page.getByLabel('email').fill('pandaachu+1@gmail.com');
  //   await page.getByLabel('密碼').fill('a12345678');

  //   // 3. 模擬 NextAuth 成功響應
  //   await page.route('**/api/auth/callback/credentials', async (route) => {
  //     await route.fulfill({
  //       status: 200,
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         ok: true,
  //         status: 200,
  //         error: null,
  //       }),
  //     });
  //   });

  //   // 點擊登入按鈕
  //   const submitButton = page.getByRole('button', { name: /登 入/ });
  //   await submitButton.click();

  // });

  test('should redirect to recipes page after successful login', async ({ page }) => {
    // await page.goto('/login', { waitUntil: 'domcontentloaded' });
    // 2. 填寫登入表單
    await page.getByLabel('email').fill('pandaachu+1@gmail.com');
    await page.getByLabel('密碼').fill('a12345678');

    // 5. 點擊登入按鈕
    const submitButton = await page.getByRole('button', { name: '登 入' });
    await submitButton.click();
    // 3. 模擬成功登入響應
    await page.route('**/api/auth/callback/credentials', async (route) => {
      await route.fulfill({
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ok: true,
          status: 200,
          error: null,
        }),
      });
    });
    // await page.waitForTimeout(3000);

    // 等待導航完成
    await page.waitForURL('/recipes');

    // 驗證當前 URL
    expect(page.url()).toBe('http://localhost:3000/recipes');
  });

  test('window.location.href redirects to /recipes', async ({ page }) => {
    // 前往起始頁面
    await page.goto('/');

    // 使用 window.location.href 導頁，並等待導航完成
    await page.evaluate(() => {
      window.location.href = '/recipes';
    });

    // 等待導航完成
    await page.waitForURL('/recipes');

    // 驗證當前 URL
    expect(page.url()).toBe('http://localhost:3000/recipes');
  });

  // 確保登入成功
  test('should verify login success state', async ({ page }) => {
    // 1. 填寫表單
    await page.getByLabel('email').fill('test@example.com');
    await page.getByLabel('密碼').fill('validPassword123');

    // 2. 監聽所有 console 日誌
    page.on('console', (msg) => {
      console.log('Browser log:', msg.text());
    });

    // 3. 監聽頁面跳轉
    const events: string[] = [];
    page.on('load', () => events.push('load'));
    page.on('domcontentloaded', () => events.push('domcontentloaded'));

    // 4. 點擊登入按鈕
    const submitButton = page.getByRole('button', { name: /登 入/ });
    await submitButton.click();

    // 5. 等待頁面加載
    await page.waitForLoadState('load');

    // 6. 輸出收集到的事件
    console.log('Page events:', events);

    // 7. 驗證URL
    const finalUrl = page.url();
    console.log('Final URL:', finalUrl);
    expect(finalUrl).toContain('/recipes');
  });
});
