import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:8000/#/login");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .fill("راهبر");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .press("Tab");
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("button", { name: "ورود" }).click();
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
