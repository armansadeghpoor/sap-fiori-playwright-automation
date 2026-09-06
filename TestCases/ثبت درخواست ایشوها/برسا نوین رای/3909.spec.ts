import { test, expect } from '@playwright/test';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('verify settings form has exactly one active scrollbar', async ({ page }) => {
  // ۱. ورود به سیستم و مسیریابی (کدهای شما)
  await page.goto('http://localhost:8000/#/login');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').click();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').fill('راهبر');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');

  // رفتن به بخش تنظیمات و فرم اعلان‌ها
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'تنظیمات' }).click();
  await page.getByRole('link', { name: '‫اعلان ها‬' }).click();

  // ۲. پیدا کردن بدنه فرم و اطمینان از لود شدن کامل آن
  const dialogBody = page.locator('fd-dialog-body');

  // به پلی‌رایت می‌گوییم قبل از بررسی اسکرول، حتماً صبر کن تا فرم رندر شود
  await expect(dialogBody).toBeVisible();

  // ۳. اجرای اسکریپت در مرورگر برای شمارش دقیق المان‌های دارای اسکرول
  const scrollableElementsCount = await dialogBody.evaluate((container) => {
    // انتخاب خود کانتینر اصلی و تمام تگ‌های داخل آن
    const allElements = [container, ...container.querySelectorAll('*')];
    let count = 0;

    for (const el of allElements) {
      // بررسی اینکه آیا محتوا از کادر بزرگ‌تر شده است؟
      const hasVerticalScroll = el.scrollHeight > el.clientHeight;
      const hasHorizontalScroll = el.scrollWidth > el.clientWidth;

      if (hasVerticalScroll || hasHorizontalScroll) {
        // خواندن استایل‌های CSS برای اطمینان از اینکه اسکرول‌بار واقعاً رسم شده است
        const style = window.getComputedStyle(el);
        const overflowStyles = [style.overflow, style.overflowX, style.overflowY];

        const causesScroll = ['auto', 'scroll', 'overlay'];
        const isScrollable = overflowStyles.some(val => causesScroll.includes(val));

        if (isScrollable) {
          count++;
          // چاپ مسیر المان در کنسول مرورگر برای دیباگ کردن در صورت خطا
          console.log(`Scrollbar found on: <${el.tagName.toLowerCase()} class="${el.className}">`);
        }
      }
    }

    return count;
  });

  // ۴. اعمال شرط نهایی: انتظار داریم کل این فرم دقیقاً فقط ۱ اسکرول‌بار داشته باشد
  expect(scrollableElementsCount).toBe(1);
});