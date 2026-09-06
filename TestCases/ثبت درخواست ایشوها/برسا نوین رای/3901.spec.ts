import { test, expect } from '@playwright/test';

test('بررسی لود شدن آخرین عکس با استفاده از اسنپ‌شات تصویری', async ({ page }) => {
    await page.goto("http://localhost:8000/#/login");
    await page
        .locator("bsu-layout-control")
        .filter({ hasText: "نام کاربری*" })
        .getByRole("textbox")
        .click();
    await page
        .locator("bsu-layout-control")
        .filter({ hasText: "نام کاربری*" })
        .getByRole("textbox")
        .fill("راهبر");
    await page
        .locator("bsu-layout-control")
        .filter({ hasText: "نام کاربری*" })
        .getByRole("textbox")
        .press("Tab");
    await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
    await page.getByRole("button", { name: "ورود" }).click();
    await page.locator('.fd-avatar__icon').click();
    await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
    await page.getByRole('button', { name: 'Product Switch' }).click();
    await page.getByText('ثبت درخواست ایشوها').last().click();
    await page.getByRole('link', { name: '3901' }).last().click();
    await page.getByRole('link', { name: '‫*حذف نشود*‬' }).dblclick();
    const lastImage = page.locator('fd-card-content img').last();
    await lastImage.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    // ۳. مقایسه تصویری با عکس مرجع
    // این متد اسکرین‌شاتِ جدید (Actual) را می‌گیرد و با مرجع (Baseline) مقایسه می‌کند.
    await expect(lastImage).toHaveScreenshot('last-image-loaded.png');
});