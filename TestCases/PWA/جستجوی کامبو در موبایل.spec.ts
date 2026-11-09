import { test, expect, chromium } from '@playwright/test';

test('ورود به سیستم در حالت PWA و باز کردن فرم ثبت درخواست', async () => {
  const browserContext = await chromium.launchPersistentContext('', {
    headless: false,
    args: ['--app=http://localhost:8000/#/login']
  });
  const pages = browserContext.pages();
  const page = pages.length > 0 ? pages[0] : await browserContext.newPage();

  if (page.url() === 'about:blank') {
    await page.goto('http://localhost:8000/#/login');
  }

  await page.locator("bsu-layout-control").filter({ hasText: "نام کاربری*" }).getByRole("textbox").click();
  await page.locator("bsu-layout-control").filter({ hasText: "نام کاربری*" }).getByRole("textbox").fill("راهبر");
  await page.locator("bsu-layout-control").filter({ hasText: "نام کاربری*" }).getByRole("textbox").press("Tab");
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("button", { name: "ورود" }).click();
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('tab', { name: 'تست موبایل-تایل default' }).click();
  await page.getByRole('heading', { name: 'جستجوی کمبو باکس' }).click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await page.getByRole('combobox', { name: 'انتخاب کنید' }).click();
  await page.getByRole('combobox', { name: 'انتخاب کنید' }).fill('تست1');
  await expect(page.getByText('تست100')).toBeVisible();
  await page.pause();
});