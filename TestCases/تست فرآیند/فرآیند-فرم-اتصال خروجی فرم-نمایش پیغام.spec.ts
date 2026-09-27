import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند", { exact: true }).click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("فرم-اتصال خروجی -نمایش پیغام").click();
  await page.getByRole("button", { name: "تست نمایش پیغام" }).click();
  await expect(page.locator("fd-layout-grid")).toContainText("تست نمایش پیغام");
  await page.getByRole("button", { name: "تایید" }).click();
});
