import { test, expect, devices } from '@playwright/test';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test.use({
  ...devices['Pixel 7'],
  storageState: 'localstorage.json'
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole('tab', { name: 'تست موبایل-تایل default' }).click();
  await page.getByRole('heading', { name: '4005' }).last().dblclick();
  await expect(page.getByRole('button', { name: 'نمایش دکمه فرآیندی در مودال' })).toBeVisible();
  await expect(page.getByRole('banner')).toContainText('');
  await expect(page.getByText('عنوان:')).toBeVisible();
});