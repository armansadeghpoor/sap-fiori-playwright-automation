import { test, expect } from '@playwright/test';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:4300');
  await expect(page.getByRole('heading', { name: 'گروه تست' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'گروه ایشو' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'اپ تایل گروپ پنجره واحد' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'نمایش گروهی اپ ها دیالوگ' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'پریدن صفحه بندی بعد از رفرش' })).toBeVisible();
  await expect(page.getByText('ریلود و ذخیره مودال')).toBeVisible();
});