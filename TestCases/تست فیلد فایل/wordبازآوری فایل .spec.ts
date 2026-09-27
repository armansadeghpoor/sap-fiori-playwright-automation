import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های نوع فایل").click();
  await page.getByText("فیلد فایل word").click();
  await page.getByText("فایل word", { exact: true }).click();
  await page
    .getByRole("row", { name: '‫"حذف نشود"‬ ' })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "" }).click(); //دکمه بازآوری
  await page.waitForTimeout(4000);
});
