import { expect, test } from '@playwright/test';

test.describe('Public Recipe List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/recipes');
  });

  test('should render header, search bar and equipment filter chips', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '食譜' })).toBeVisible();
    await expect(page.getByPlaceholder(/搜尋食材/)).toBeVisible();
    // A few representative chips from constants/recipe.ts COOKING_TOOLS
    for (const tool of ['氣炸鍋', '小V鍋', '金小萬']) {
      await expect(page.getByRole('button', { name: tool })).toBeVisible();
    }
  });

  test('equipment chip should toggle active state', async ({ page }) => {
    const chip = page.getByRole('button', { name: '氣炸鍋' });
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await chip.click();
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    await chip.click();
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
  });

  test('should render sort options and fridge mode toggle', async ({ page }) => {
    for (const label of ['最新', '最常煮', '評分最高']) {
      await expect(page.getByRole('button', { name: label })).toBeVisible();
    }
    const fridgeToggle = page.getByRole('button', { name: /冰箱模式/ });
    await expect(fridgeToggle).toBeVisible();

    // Enabling fridge mode shows the ingredient input and hides sort options
    await fridgeToggle.click();
    await expect(page.getByPlaceholder(/輸入手邊食材/)).toBeVisible();
    await expect(page.getByRole('button', { name: '最新' })).toHaveCount(0);
  });

  test('root should redirect to /recipes', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL('/recipes');
    expect(page.url()).toContain('/recipes');
  });
});
