import { expect, test } from '@playwright/test';

const SEED_ITEMS = [
  { ingredient: '雞蛋', quantity: '3顆', recipeTitle: '測試食譜', checked: false },
  { ingredient: '蔥', quantity: '1把', recipeTitle: '測試食譜', checked: false },
];

test.describe('Shopping List', () => {
  test('should show empty state without items', async ({ page }) => {
    await page.goto('/shopping-list');
    await expect(page.getByText('清單是空的')).toBeVisible();
    await expect(page.getByRole('link', { name: '去食譜挑食材' })).toBeVisible();
  });

  test('should render seeded items, toggle checked and clear', async ({ page }) => {
    await page.addInitScript((items) => {
      localStorage.setItem('shopping-list', JSON.stringify(items));
    }, SEED_ITEMS);
    await page.goto('/shopping-list');

    await expect(page.getByText('雞蛋')).toBeVisible();
    await expect(page.getByText('蔥', { exact: false }).first()).toBeVisible();

    // Toggle first item → strikethrough style class applied
    const firstCheckbox = page.getByRole('checkbox').first();
    await firstCheckbox.check();
    await expect(page.getByText('雞蛋')).toHaveClass(/line-through/);

    // Clear checked → only 蔥 remains
    await page.getByRole('button', { name: /清除已買/ }).click();
    await expect(page.getByText('雞蛋')).toHaveCount(0);

    // Clear all → back to empty state
    await page.getByRole('button', { name: '全部清空' }).click();
    await expect(page.getByText('清單是空的')).toBeVisible();
  });
});
