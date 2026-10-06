import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  test.setTimeout(50000);
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "بازآوری ساختار" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند").click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("تست کاربر آغازکننده فرآیند").click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .fill("آوا");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .press("Tab");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "سن:" })
    .getByRole("textbox")
    .fill("26");
  await page.getByRole("button", { name: "تایید" }).click();
  await expect(page.locator("fd-layout-grid")).toContainText("نام:آواسن:26");
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByTitle('Close').click();
  await page.getByRole("button", { name: "تایید" }).click();
});
