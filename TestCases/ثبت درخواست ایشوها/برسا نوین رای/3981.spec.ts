import { test, expect } from '@playwright/test';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 1080,
    width: 1920
  }
});

// ⭐️ نکته مهم: کلمه context را اینجا در کنار page اضافه کن
test('test', async ({ page, context }) => {
  await page.goto('http://localhost:8000/#/login');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').click();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').fill('راهبر');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');

  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('link', { name: 'کارتابل وارده تفکیکی' }).click();
  await page.getByText('تمامی سمتهای من').click();
  await page.getByText('تمامی سمتهای من').click();
  await page.waitForTimeout(3000);

  // ⭐️ تغییر کلیدی در این بخش است
  const [newTab] = await Promise.all([
    context.waitForEvent('page'), // گوش دادن به رویداد باز شدن تب در کل مرورگر
    page.locator('div.tw-flex.tw-gap-1').first().click({ modifiers: ['Control'] })
  ]);

  // منتظر می‌مانیم تا تب جدید لود شود
  await newTab.waitForLoadState();

  // تب جدید را به جلوی صفحه می‌آوریم تا ببینیمش
  await newTab.bringToFront();
  await page.waitForTimeout(5000);
  await expect(newTab.locator('#fd-panel-title-0')).toContainText('محتوای پیام');
});