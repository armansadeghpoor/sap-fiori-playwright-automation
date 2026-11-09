import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";
import { recordingDevices } from "../../framework/config/recording-devices";
import { restoreSnapshot } from "../../framework/api/environment.api";

test.use({
  ...recordingDevices["desktop"],
  browserName: "chromium",
  channel: "chrome",
  storageState: { cookies: [], origins: [] },
});

test("زمان در فیلد تاریخ‌وزمان", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);

  // Paste the recorded business actions and assertions here.
  await page.locator('fd-user-menu-control').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByRole('menuitem', { name: 'تست مخصوص وب جدید سناریو برای بخش های مختلف وب جدید' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).fill('فیلد زمان');
  await page.getByRole('link', { name: 'فیلد زمان' }).click();
  await page.getByRole('button', { name: 'جدید', exact: true }).click();
  await page.getByRole('button', { name: 'select day' }).click();
  await page.getByRole('button', { name: 'امروز' }).click();
  await page.getByRole('button', { name: 'تایید' }).click();
  await page.getByRole('button', { name: 'select time' }).click();
  await page.getByText('00:30').click();
  await page.getByRole('button', { name: 'ذخیره و بستن' }).click();
  await page.getByRole('link', { name: '‫1405/08/17 12:30 ق.ظ‬' }).dblclick();
  await page.getByRole('combobox', { name: 'HH:mm' }).click();
  await page.getByRole('combobox', { name: 'HH:mm' }).fill('00:50');
  await page.getByRole('button', { name: 'ذخیره و بستن' }).click();
});
