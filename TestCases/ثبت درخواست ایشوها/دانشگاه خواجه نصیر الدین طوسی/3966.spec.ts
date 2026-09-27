import { test, expect } from '@playwright/test';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test.use({
  storageState: 'localstorage.json'
});

// 💡 دقت کن: کلمه context را حتماً باید به اینجا اضافه کنی
test('test', async ({ page, context }) => {
  await loginAs(page, users.rahbar);

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