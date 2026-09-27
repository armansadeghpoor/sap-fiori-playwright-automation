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
  await page.getByRole("link", { name: "تست نمای چندصفحه ای" }).click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.getByRole("button", { name: "بیشتر" })).toBeVisible();
  await page.getByRole("button", { name: "بیشتر" }).click();
  await page
    .locator("fd-popover-body li a")
    .getByText("درست/نادرسا default")
    .click();
});
