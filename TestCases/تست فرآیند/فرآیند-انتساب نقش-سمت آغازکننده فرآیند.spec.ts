import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  test.setTimeout(60000);
  await restoreSnapshot(request);
  await loginAs(page, users.user1);
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "بازآوری ساختار" }).click();
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند").click();
  await page
    .locator("div")
    .filter({ hasText: /^اجرای فرآیندها$/ })
    .nth(2)
    .click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("تست سمت آغازکننده فرآیند").click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("نام1");
  await page.getByRole("textbox").press("Tab");
  await page.getByRole("spinbutton").fill("45");
  await page.getByRole("button", { name: "تایید" }).click();
  await expect(page.locator('div').filter({ hasText: 'نام:نام1شماره پرسنلی:‪45' }).nth(3)).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "تایید" }).click();
});
