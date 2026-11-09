import { test, expect } from "@playwright/test";
import { recordingDevices } from "../../../framework/config/recording-devices";

test.use({
  ...recordingDevices["desktop"],
  browserName: "chromium",
  channel: "chrome",
  storageState: { cookies: [], origins: [] },
});

test("نمایش اطلاعات پشتیبانی در پورتال", async ({ page }) => {
  await page.goto("http://localhost:4300/#/servicedesk");

  const toolbar = page.getByRole("toolbar");

  await expect(toolbar).toBeVisible();

  await expect(toolbar).toContainText("ایمیل پشتیبانی:");
  await expect(toolbar).toContainText("Portal@example.com");
  await expect(toolbar).toContainText("شماره پشتیبانی:");
  await expect(toolbar).toContainText("آمار بازدید");
  await expect(toolbar).toContainText("کانال ارتباطی");
  await expect(toolbar).toContainText("پورتال برسا نوین رای");
});