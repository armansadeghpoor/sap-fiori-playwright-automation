import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();


  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد عددی").click();
  await page
    .locator("div")
    .filter({ hasText: /^فیلد عددی-بیشترین مقدار$/ })
    .nth(2)
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "بیشترین مقدار صحیح:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "بیشترین مقدار صحیح:" })
    .getByRole("textbox")
    .fill("3000");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("fd-dialog-body div")).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "بیشترین مقدار صحیح:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "بیشترین مقدار صحیح:" })
    .getByRole("textbox")
    .press("ArrowRight");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "بیشترین مقدار صحیح:" })
    .getByRole("textbox")
    .press("ArrowRight");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "بیشترین مقدار صحیح:" })
    .getByRole("textbox")
    .press("ArrowRight");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "بیشترین مقدار صحیح:" })
    .getByRole("textbox")
    .press("ArrowRight");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "بیشترین مقدار صحیح:" })
    .getByRole("textbox")
    .press("ArrowRight");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "بیشترین مقدار صحیح:" })
    .getByRole("textbox")
    .press("ArrowRight");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "بیشترین مقدار صحیح:" })
    .getByRole("textbox")
    .fill("3,00");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
