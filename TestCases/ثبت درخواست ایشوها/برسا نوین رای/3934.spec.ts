import { test, expect } from '@playwright/test';

test.use({
  storageState: 'localstorage.json'
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:8000/#/login');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').click();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').fill('راهبر');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');
  const mainMenuButton = page.locator('button.fd-shellbar__button--menu');
  await mainMenuButton.click();
  await page.getByRole('menuitem', { name: 'صفحه اصلی' }).nth(1).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.locator('#cdk-overlay-1').getByText('ثبت درخواست ایشوها').click();
  await page.getByRole('link', { name: '3934' }).last().click();
  await page.getByText('‫*حذف نشود*‬').dblclick();
  await expect(page.locator('bsu-ly-label')).toContainText('عنوان 1');
  await page.getByRole('link', { name: '3925' }).last().click();
  await page.getByText('‫تست 1‬').dblclick();
  await expect(page.locator('#LayoutItem_8')).toContainText('عنوان:');
});