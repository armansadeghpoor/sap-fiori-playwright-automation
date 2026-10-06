import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست فیلد").click();
  await page
    .locator("bsu-barsa-tree-item li")
    .getByText("فیلد های رابطه ای")
    .click();
  await page
    .locator("bsu-barsa-tree-item li")
    .getByText("رابطه عکس تکی تکی")
    .click();
  await page
    .locator("div")
    .filter({ hasText: /^رابطه تکی-یک به یک-دانشجو$/ })
    .nth(2)
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .fill("شیدا");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام خانوادگی:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام خانوادگی:" })
    .getByRole("textbox")
    .fill("بهرامیان");
  await page.getByRole("button", { name: "" }).click();
  await page.locator("label").filter({ hasText: "کارشناسی" }).first().click();
  await page.getByRole("button", { name: "select day" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "1405" }).click();
  await page.waitForTimeout(1000);
  await page.getByLabel("1405").click();
  await page.waitForTimeout(1000);
  await page.locator("fd-toolbar div").getByRole("button").nth(2).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "تیر" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "۲۳" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page
    .getByText("رابطه عکس تکی(تکی)-مدرک تحصیلی مرتبط با دانشجو")
    .click();
  await page
    .locator("bsu-barsa-row-inline-actionlist")
    .getByRole("button")
    .dblclick();
  await expect(
    page.locator("bsu-ui-mo-info-combo-viewer").getByRole("textbox")
  ).toHaveValue("شیدا");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
