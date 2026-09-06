import { test, expect } from '@playwright/test';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 950,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:8000/#/login');
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('کارتابل');
  await page.locator('input[type="text"]').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('link', { name: 'کارتابل وارده تفکیکی' }).click();
  await expect(page.getByText('تمامی سمتهای من (12)')).toBeVisible();
  await expect(page.getByText('منشی ایشو 4070 (کارتابل) (1)')).toBeVisible();
  const targetItem = page.locator('#fd-list-item-39 > div:nth-child(2) > div > .fd-list__title > .ellapsis');
  await targetItem.scrollIntoViewIfNeeded();
  await expect(targetItem).toBeVisible();
});