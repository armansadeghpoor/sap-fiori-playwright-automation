import { test, expect } from '@playwright/test';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test.use({
  storageState: 'localstorage.json'
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
 
  await page.waitForTimeout(5000);

  const splitter = page.locator('.splitter-line');
  const navigatorPanel = page.locator('#menu-right-mini-1');

  const initialPanelBox = await navigatorPanel.boundingBox();
  const splitterBox = await splitter.boundingBox();

  if (!initialPanelBox || !splitterBox) {
    throw new Error("اسپلیتر یا پنل نویگیتور در صفحه رندر نشده‌اند یا مخفی هستند!");
  }

  await page.mouse.move(splitterBox.x + splitterBox.width / 2, splitterBox.y + splitterBox.height / 2);
  await page.mouse.down();

  await page.mouse.move(splitterBox.x - 400, splitterBox.y + splitterBox.height / 2, { steps: 20 });
  await page.mouse.up();

  await page.waitForTimeout(500);
  const newPanelBox = await navigatorPanel.boundingBox();

  if (!newPanelBox) {
    throw new Error("پنل نویگیتور بعد از درگ کردن در صفحه پیدا نشد!");
  }

  expect(newPanelBox.width).toBeGreaterThan(initialPanelBox.width);
});