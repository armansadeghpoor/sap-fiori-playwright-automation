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
  await page.getByText("رابطه عکس تکی تکی").click();
  await page
    .getByText(
      "رابطه عکس تکی(تکی)-رشته ورزشی-نمایش دکمه جدید-لیست popup- نمایش زیرفرم"
    )
    .click();
  await expect(page.getByText("‫1‬")).toBeVisible();
  await page
    .getByRole("row", { name: "‫بدنسازی‬ ‫انفرادی‬ ‫1‬ " })
    .getByRole("button")
    .click();
  await page.getByRole("textbox", { name: "1" }).click();
  await page.getByRole("textbox", { name: "1" }).fill("55");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("tbody")).toContainText("‫55‬");
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان:" })
    .getByRole("textbox")
    .fill("تست");
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("تیمی").click();
  await page.locator("bsu-ui-text-field input").nth(1).click();
  await page.locator("bsu-ui-text-field input").nth(1).fill("66");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByText("‫66‬")).toBeVisible();
});
