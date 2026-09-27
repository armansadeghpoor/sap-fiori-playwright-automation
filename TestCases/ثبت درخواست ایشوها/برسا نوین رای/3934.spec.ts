import { test, expect } from '@playwright/test';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test.use({
  storageState: 'localstorage.json'
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
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