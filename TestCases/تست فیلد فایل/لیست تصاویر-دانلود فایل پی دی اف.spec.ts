import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator(".fd-avatar__icon").click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page
    .getByRole("listitem")
    .filter({ has: page.getByText("تست مخصوص وب جدید", { exact: true }) })
    .click();
  await page.getByTitle("سیستم تست وب جدید").click();
  await page.getByRole("link", { name: "لیست تصاویر-دانلود فایل PDF" }).click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: " دانلود" }).click();
  const download2Promise = page.waitForEvent("download");
  await page.locator(".fd-card__content > .ng-star-inserted").first().click();
  const download2 = await download2Promise;
});
