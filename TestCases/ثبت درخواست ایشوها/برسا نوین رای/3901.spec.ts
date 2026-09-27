import { test, expect } from '@playwright/test';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test('بررسی لود شدن آخرین عکس با استفاده از اسنپ‌شات تصویری', async ({ page }) => {
  await loginAs(page, users.rahbar);
    await page.locator('.fd-avatar__icon').click();
    await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
    await page.getByRole('button', { name: 'App Launcher' }).click();
    await page.getByText('ثبت درخواست ایشوها').last().click();
    await page.getByRole('link', { name: '3901' }).last().click();
    await page.getByRole('link', { name: '‫*حذف نشود*‬' }).dblclick();
    const lastImage = page.locator('fd-card-content img').last();
    await lastImage.scrollIntoViewIfNeeded();
    await lastImage.click();
    await page.waitForTimeout(1000);
    // ۳. مقایسه تصویری با عکس مرجع
    // این متد اسکرین‌شاتِ جدید (Actual) را می‌گیرد و با مرجع (Baseline) مقایسه می‌کند.
    await expect(lastImage).toHaveScreenshot('last-image-loaded.png', {
        maxDiffPixels: 200,
    });
});