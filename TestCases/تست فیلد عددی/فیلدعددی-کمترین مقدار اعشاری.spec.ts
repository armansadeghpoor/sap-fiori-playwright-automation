import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();


  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد عددی").click();
  await page.getByText("عددی-کمترین مقدار").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "کمترین مقدار اعشاری:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "کمترین مقدار اعشاری:" })
    .getByRole("textbox")
    .fill("66.6660");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("fd-dialog-body div")).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "کمترین مقدار اعشاری:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "کمترین مقدار اعشاری:" })
    .getByRole("textbox")
    .press("End");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "کمترین مقدار اعشاری:" })
    .getByRole("textbox")
    .fill("6600.000");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "کمترین مقدار اعشاری:" })
    .getByRole("textbox")
    .press("ArrowRight");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "کمترین مقدار اعشاری:" })
    .getByRole("textbox")
    .fill("120.6530");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
