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
  await page.locator('input[type="text"]').fill('راهبر');
  await page.locator('input[type="text"]').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('تست گزارش').click();
  await page.getByRole('link', { name: 'تست گزارش از نوع گانت' }).last().click();
  await expect(page.locator('bsu-gantt-dhtml-chart-view')).toContainText('75% پروژه 1100% پروژه 1.175% کار 1100% کار 1.1نقطه عطف 1نقطه عطف 1.180% پروژه 1.280% کار 1.2نقطه عطف 1.2');
  await expect(page.getByRole('rowgroup')).toContainText('پروژه 11404-10-2211404-10-2375پروژه 1.11404-10-2211404-10-23100کار 11404-10-2241404-10-2675کار 1.11404-10-2221404-10-24100نقطه عطف 11404-10-1501404-10-1550نقطه عطف 1.11404-10-2201404-10-22100پروژه 1.21404-10-2211404-10-2380کار 1.21404-10-2421404-10-2680نقطه عطف 1.21404-10-2401404-10-2450');
  await expect(page.getByText('جدیدروزماهسال')).toBeVisible();
  await page.getByRole('button', { name: 'سال' }).click();
  await page.getByRole('button', { name: 'ماه' }).click();
  await page.getByRole('button', { name: 'روز' }).click();
});