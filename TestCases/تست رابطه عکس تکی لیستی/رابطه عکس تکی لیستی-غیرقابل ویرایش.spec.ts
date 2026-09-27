import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه عکس تکی لیستی").click();
  await page.getByText("رابطه عکس تکی(لیستی)-انواع نمایش-واحد سازمانی").click();
  await page.getByRole("row", { name: "‫فروش‬ " }).getByRole("button").click();
  await page
    .getByRole("tab", {
      name: "پرسنل حاضر در این واحد-نمایش در فرم مستقل-غیرقابل ویرایش default",
    })
    .click();
  await page
    .getByRole("row", { name: "‫‪32‬ ‫فروش‬ " })
    .getByRole("button")
    .click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "" }).click();
  await expect(
    page
      .locator("div")
      .filter({ hasText: "شماره پرسنلی:‪87واحد مربوطه:" })
      .nth(3)
  ).toBeVisible();
  await page.getByTitle('Close').click();
});
