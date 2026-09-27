import { test, expect } from '@playwright/test';
import { loginAs } from '../../framework/auth/auth.service';
import { users } from '../../framework/auth/users';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 950,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('تست مخصوص وب جدید', { exact: true }).click();
  await page.getByRole('link', { name: 'قابلیت ویرایش در لیست' }).click();
  await page.locator('a').filter({ hasText: '‫‪15‬' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('cell', { name: '15' }).getByRole('textbox').press('ArrowDown');
  await page.waitForTimeout(500);
  await expect(page.getByRole('cell', { name: '20' }).getByRole('textbox')).toBeVisible();
  await page.waitForTimeout(500);
  await page.getByRole('cell', { name: '20' }).getByRole('textbox').click();
  await page.waitForTimeout(500);
  await page.getByRole('cell', { name: '20' }).getByRole('textbox').press('ArrowDown');
  await page.waitForTimeout(500);
  await page.getByRole('cell', { name: '25' }).getByRole('textbox').press('ArrowUp');
  await page.waitForTimeout(500);
  await page.getByRole('cell', { name: '20' }).getByRole('textbox').press('ArrowUp');
  await page.waitForTimeout(500);
  await page.getByRole('cell', { name: '15' }).getByRole('textbox').press('Tab');
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'علی' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'علی' }).press('Tab');
  await page.waitForTimeout(500);
  await page.getByRole('cell', { name: '15' }).press('Shift+Tab');
});