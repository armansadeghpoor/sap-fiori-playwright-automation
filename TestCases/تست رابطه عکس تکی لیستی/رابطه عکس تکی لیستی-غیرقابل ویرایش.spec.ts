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
  await page.getByRole('link', { name: '‫فروش‬' }).dblclick();
await page.getByRole('button', { name: 'پرسنل حاضر در این واحد-نمایش در فرم مستقل-غیرقابل ویرایش' }).click();
  // await page
  //   .getByRole("row", { name: "‫‪32‬ ‫فروش‬ " })
  //   .getByRole("button")
  //   .click();
  
  await page.locator('#cdk-overlay-1').getByRole('link', { name: '‫‪32‬' }).dblclick();
  await page.waitForTimeout(1000);
  await expect(page.locator('bsu-ly-layout-container-of-root').filter({ hasText: 'شماره پرسنلی:‪32واحد مربوطه:' })).toBeVisible();
});
