import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه عکس تکی لیستی").click();
  await page.getByText("رابطه تکی -پرسنل سازمان").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("313");
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("پروژه").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("رابطه عکس تکی(لیستی)-انواع نمایش-واحد سازمانی").click();
  await page
    .getByRole("row", { name: "‫پروژه‬ " })
    .getByRole("button")
    .click();
  await page.waitForTimeout(1000);
  await page
    .locator("bsu-barsa-row-inline-actionlist")
    .getByRole("button")
    .nth(0)
    .click();
  await expect(page.locator("bsu-barsa-table-row")).toContainText("‫‪313‬");
  await expect(page.locator("bsu-barsa-table-row")).toContainText("‫پروژه‬");
});
