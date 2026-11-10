
import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";
import { recordingDevices } from "../../../framework/config/recording-devices";

test.use({
  ...recordingDevices["desktop"],
  browserName: "chromium",
  channel: "chrome",
  storageState: { cookies: [], origins: [] },
});

test("4305", async ({ page }) => {
  await loginAs(page, users.rahbar);

  await page.locator(".fd-avatar__icon").click();

  await page.getByRole("menuitem", {
    name: "نویگیتور",
  }).click();

  await page.getByRole("button", {
    name: "App Launcher",
  }).click();

  await page.getByRole("menuitem", {
    name: "ثبت درخواست ایشوها ایشوها ثبت شده در سامانه ثبت درخواست",
  }).click();

  await page.getByRole("searchbox", {
    name: "جستجو در گزارش‌ها",
  }).fill("4305");

  await page.getByRole("link", {
    name: "4305",
  }).click();

  await page.getByRole("link", {
    name: "*حذف نشود*",
  }).dblclick();

  const reportContent = page.locator(
    "fd-dynamic-page-content"
  );

  await expect(reportContent.getByText(
    "گزارش مرتبط",
    { exact: true }
  )).toBeVisible();

  const firstRecord = reportContent
    .getByRole('link', { name: '‫تست1‬' });

  await expect(firstRecord).toBeVisible();

  await expect.poll(async () => {
    return firstRecord.evaluate((element) => {
      const boundary = element.closest(
        "fd-dynamic-page-content"
      );

      let parent = element.parentElement;

      while (parent && parent !== boundary) {
        const style = window.getComputedStyle(parent);

        const hasVerticalScroll =
          ["auto", "scroll"].includes(style.overflowY) &&
          parent.scrollHeight > parent.clientHeight + 2;

        if (hasVerticalScroll) {
          return true;
        }

        parent = parent.parentElement;
      }

      return false;
    });
  }, {
    timeout: 10000,
    message: "Related report should have vertical scrolling",
  }).toBe(true);

  const lastRecord = reportContent
    .getByRole('link', { name: '‫تست100‬' });

  await expect(lastRecord).not.toBeInViewport({
    timeout: 10000,
  });
});
