import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  test.setTimeout(60000);
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "بازآوری ساختار" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند", { exact: true }).click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("فرم-اتصال خروجی-ترتیب").click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("غایب").click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("تنظیمات اتصال خروجی").click();
  await page.getByText("اتصال فرم-ترتیب").click();
  await page.getByTitle("غایب").locator("div").click();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("tbody")).toContainText("‫پایان‬");
  await page.getByRole("button", { name: "تایید" }).click();
});
