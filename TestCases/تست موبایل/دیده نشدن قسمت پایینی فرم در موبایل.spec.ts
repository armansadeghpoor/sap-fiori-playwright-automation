import { test, expect, devices } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  ...devices["Pixel 7"],
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("tab", { name: "تست موبایل-تایل default" }).click();
  await page
    .getByRole("heading", { name: "دیده نشدن قسمت پایین فرم در موبایل" })
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "مرحله بعد" }).click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "شماره دهی" }).click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("کاربر1").click();
});
