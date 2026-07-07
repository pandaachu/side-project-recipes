import { expect, test } from '@playwright/test';

test.describe('Login Page (Google-only)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should render Google login button only', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '登入' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Google 登入/ })).toBeVisible();
    // Credentials form was removed — no email/password inputs
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
    await expect(page.getByText('僅限授權帳號使用')).toBeVisible();
  });

  test('signup page should no longer exist', async ({ page }) => {
    const response = await page.goto('/signup');
    expect(response?.status()).toBe(404);
  });
});
