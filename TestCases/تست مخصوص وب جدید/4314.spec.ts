import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";
import { recordingDevices } from "../../framework/config/recording-devices";

test.use({
  ...recordingDevices["desktop"],
  browserName: "chromium",
  channel: "chrome",
  storageState: { cookies: [], origins: [] },
});

test("4314", async ({ page }) => {
  test.setTimeout(50000);
  await loginAs(page, users.rahbar);

  // Paste the recorded business actions and assertions here.
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByRole('menuitem', { name: 'ثبت درخواست ایشوها ایشوها ثبت شده در سامانه ثبت درخواست' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).fill('4314');
  await page.getByRole('link', { name: '4314' }).click();
  await page.getByRole('link', { name: '‫پیشنویس‬' }).dblclick();
  await page.locator('#headerCollapse').click();
  await page.getByRole('link', { name: '‫این یک رکورد با متنی بسیار طولانی در جهت تست شرکت فکور صنعت می باشد‬' }).click();
  await page.getByRole('gridcell', { name: '96' }).first().click();
  await page.getByRole('gridcell', { name: 'تست' }).nth(3).click();
  await page.getByRole('gridcell', { name: '96' }).first().click();
  await page.getByRole('gridcell', { name: 'تست' }).nth(3).click();
  await page.getByRole('link', { name: '‫111‬' }).click();
  await page.getByRole('gridcell', { name: '96' }).first().click();
  await page.getByRole('gridcell', { name: 'تست' }).nth(3).click();
  await page.getByRole('gridcell', { name: '96' }).first().click();
  await page.getByRole('gridcell', { name: 'تست' }).nth(3).click();
  await page.getByRole('link', { name: '‫23‬' }).click();
  await page.getByRole('gridcell', { name: '96' }).first().click();
  await page.getByRole('gridcell', { name: 'تست' }).nth(3).click();
  await page.getByRole('gridcell', { name: '96' }).first().click();
  await page.getByRole('gridcell', { name: 'تست' }).nth(3).click();
  await page.getByRole('link', { name: '‫4455566‬' }).click();
  await page.getByRole('gridcell', { name: '96' }).first().click();
  await page.getByRole('gridcell', { name: 'تست' }).nth(3).click();
  await page.getByRole('gridcell', { name: '96' }).first().click();
  await page.getByRole('gridcell', { name: 'تست' }).nth(3).click();
  await page.getByRole('gridcell', { name: '96' }).first().click();
  await page.getByRole('link', { name: '‫این یک رکورد با متنی بسیار طولانی در جهت تست شرکت فکور صنعت می باشد‬' }).click();
  await page.getByRole('gridcell', { name: '96' }).first().click();
  await page.getByRole('gridcell', { name: 'تست' }).nth(3).click();
  await page.getByRole('link', { name: '‫111‬' }).click();
  await page.getByRole('gridcell', { name: '96' }).first().click();
  await page.getByRole('gridcell', { name: 'تست' }).nth(3).click();
  await page.getByRole('button', { name: 'Close' }).click();
});
