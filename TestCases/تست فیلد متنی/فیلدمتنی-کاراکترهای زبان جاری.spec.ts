import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد متنی").click();
  await page.getByText("متنی-غیرترکیبی(به جز فیلد اجباری)").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "فیلد کاراکترهای زبان جاری:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "فیلد کاراکترهای زبان جاری:" })
    .getByRole("textbox")
    .fill("test");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.getByText(
      "استفاده از حروف انگلیسی در فیلد 'فیلد کاراکترهای زبان جاری' مجاز نیست!"
    )
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("textbox", { name: "test" }).click();
  await page.getByRole("textbox", { name: "test" }).fill("تست");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "فیلد کاراکترهای زبان جاری:" })
    .locator("bsu-ui-text-field")
    .click();
});
