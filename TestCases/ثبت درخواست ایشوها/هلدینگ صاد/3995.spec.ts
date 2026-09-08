import { test, expect } from '@playwright/test';

test.use({
    storageState: 'localstorage.json',
    viewport: {
        height: 1080,
        width: 1920
    }
});

test("test", async ({ page }) => {
    await page.goto('http://localhost:8000/#/login');
    await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').click();
    await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').fill('راهبر');
    await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').press('Tab');
    await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
    await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');
    await page.locator('button.fd-shellbar__button--menu').click();
    await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
    await page.getByRole('button', { name: 'App Launcher' }).click();
    await page.locator('#cdk-overlay-1').getByText('ثبت درخواست ایشوها').click();
    await page.getByRole('link', { name: '3995' }).last().click();
    await page.getByRole('button', { name: 'جدید' }).click();
    await page.locator('bsu-ui-num-int-ui input').click();
    await page.locator('bsu-ui-num-int-ui input').fill('-23');
    await page.locator('bsu-ui-num-int-ui input').press('Tab');
    await page.locator('bsu-ui-num-decimal-ui').getByRole('textbox').fill('-23');
    await expect( page.locator('bsu-ui-num-int-ui input')).toHaveValue('-23');
    await expect(page.locator('bsu-ui-num-decimal-ui').getByRole('textbox')).toHaveValue('-23');
    await page.locator('bsu-ui-num-int-ui input').click();
    await page.locator('bsu-ui-num-int-ui input').fill('-595');
    await page.locator('bsu-ui-num-int-ui input').press('Tab');
    await page.locator('bsu-ui-num-decimal-ui').getByRole('textbox').fill('-595');
    await expect(page.locator('bsu-ui-num-int-ui input')).toHaveValue('-595');
    await expect(page.locator('bsu-ui-num-decimal-ui').getByRole('textbox')).toHaveValue('-595');
});