import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه لیستی").click();
  await page
    .getByText("فیلد رابطه لیستی-رابطه دارد-چپ به راست - غیر قابل ویرایش")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("tab", { name: "غیرقابل ویرایش default" }).click();
  await page.locator("bsu-no-data").click();
});
