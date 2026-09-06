import { test, expect } from '@playwright/test';

test.use({
  storageState: 'localstorage.json'
});

// 💡 دقت کن: کلمه context را حتماً باید به اینجا اضافه کنی
test('test', async ({ page, context }) => {
  await page.goto('http://localhost:8000/#/login');

  // فرآیند لاگین
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').click();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').fill('راهبر');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');

  await page.getByRole('heading', { name: 'پریدن صفحه بندی بعد از رفرش' }).click();

  // 💡 بخش هندل کردن تب جدید:
  const linkLocator = page.getByRole('link', { name: '‫تست 1‬' });

  // همزمان هم به پلی‌رایت می‌گوییم منتظر تب جدید باش، هم با Ctrl+Click لینک را در تب جدید باز می‌کنیم
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    linkLocator.click({ modifiers: ['Control'] }) // این کار دقیقاً معادل Open in new tab است
  ]);

  await newPage.bringToFront();
  await newPage.getByTitle('Close').click();
  // اگر نیاز بود تب جدید را ببندی و به همان صفحه اول برگردی:
  await newPage.close();
});