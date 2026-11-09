import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";
import { recordingDevices } from "../../../framework/config/recording-devices";
import { restoreSnapshot } from "../../../framework/api/environment.api";

test.use({
  ...recordingDevices["desktop"],
  browserName: "chromium",
  channel: "chrome",
  storageState: { cookies: [], origins: [] },
});

test("4201", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);

  // Paste the recorded business actions and assertions here.
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByRole('menuitem', { name: 'ثبت درخواست ایشوها ایشوها ثبت شده در سامانه ثبت درخواست' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).fill('4201');
  await page.getByRole('link', { name: '4201' }).click();
  await page.getByRole('link', { name: '‫*حذف نشود*‬' }).dblclick();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'جدید' }).click();
  await page.locator('iframe[title="Rich Text Area"]').contentFrame().getByLabel('Rich Text Area. Press ALT-0').fill('﻿تست متن پیشرفته\n');
  await page.getByRole('button', { name: 'Default Action' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'ذخیره و بستن' }).click();
  await page.getByRole('link', { name: '‫*حذف نشود*‬' }).dblclick();
  const editors = page.locator('iframe.tox-edit-area__iframe');
  const editor = page
    .frameLocator('iframe.tox-edit-area__iframe')
    .first()
    .locator('body#tinymce');
});
