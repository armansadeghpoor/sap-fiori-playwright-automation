import { test, expect } from '@playwright/test';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test.use({
    storageState: 'localstorage.json',
    viewport: {
        height: 1080,
        width: 1920
    }
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
    await page.locator('button.fd-shellbar__button--menu').click();
    await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
    await page.getByRole('button', { name: 'App Launcher' }).click();
    await page.getByText('ثبت درخواست ایشوها').last().click();
    await page.getByRole('link', { name: '4092' }).last().click();
    await page.getByRole('button', { name: 'جدید' }).click();
    await page.locator('bsu-ui-num-int-ui').getByRole('textbox').click();
    await page.locator('bsu-ui-num-int-ui').getByRole('textbox').fill('6');
    await expect(page.getByText('نمایش پیغام نمایش پیغام نمایش پیغام نمایش پیغام نمایش پیغام نمایش پیغام نمایش پی')).toBeVisible();
    await page.getByRole('button', { name: 'تایید' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'خیر', exact: true }).click();
    await expect(page.getByText('(موردی یافت نشد)')).toBeVisible();
});