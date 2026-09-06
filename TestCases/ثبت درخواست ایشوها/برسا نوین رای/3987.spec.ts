import { test, expect } from '@playwright/test';

test('verify shellbar buttons remain visible after window resize', async ({ page }) => {

  // ۱. تنظیم سایز اولیه مرورگر به حالت دسکتاپ (مثلاً Full HD)
  await page.setViewportSize({ width: 1920, height: 1080 });

  await page.goto('http://localhost:8000/#/login');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').click();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').fill('راهبر');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();

  // ۲. تعریف لوکیتورهای دکمه‌های اصلی هدر (از روی کدهای HTML شما)
  const worldButton = page.locator('button[glyph="world"]');
  const bellButton = page.locator('button:has(.sap-icon--bell)');
  const avatarButton = page.locator('fd-avatar.fd-avatar--circle');

  // ۳. اطمینان از اینکه در حالت دسکتاپ همه‌چیز درست لود شده است
  await expect(worldButton).toBeVisible();
  await expect(bellButton).toBeVisible();
  await expect(avatarButton).toBeVisible();

  // ۴. شبیه‌سازی تغییر سایز صفحه (Resize) به حالت تبلت یا موبایل
  // پلی‌رایت در کسری از ثانیه سایز پنجره را تغییر می‌دهد
  await page.setViewportSize({ width: 768, height: 1024 }); // سایز تبلت عمودی

  // کمی صبر می‌کنیم تا انیمیشن‌های احتمالی فریم‌ورک تمام شود (اختیاری اما مفید)
  await page.waitForTimeout(500);

  // ۵. اسرت‌های نهایی: تایید می‌کنیم که دکمه‌ها پس از ریسایز غیب نشده‌اند!
  await expect(worldButton).toBeVisible();
  await expect(bellButton).toBeVisible();
  await expect(avatarButton).toBeVisible();

  // ۶. (اختیاری) تست ریسایز به سایز موبایل کوچک
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
  await expect(avatarButton).toBeVisible(); // معمولاً آواتار در موبایل هم می‌ماند
});