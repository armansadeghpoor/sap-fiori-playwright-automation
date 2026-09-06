import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot"
  );
  await page.goto("http://localhost:8000/#/login");
  await page.waitForTimeout(2000);
  await page.reload();
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
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه لیستی").click();
  await page.getByText("فیلد رابطه لیستی-رابطه دارد-انواع نمایش").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("fd-input-group div span")
    .getByRole("button")
    .nth(1)
    .click();
  await page.getByRole("option", { name: "کیف" }).locator("label span").click();
  await page.locator("fd-tokenizer div input").nth(1).click();
  await page.locator("fd-tokenizer div input").nth(1).fill("کف");
  await page.getByRole("option", { name: "کفش" }).locator("label span").click();
  await page.locator("fd-tokenizer div input").nth(1).click();
  await page.locator("fd-tokenizer div input").nth(1).fill("");
  // await expect(page.locator("#fd-popover-9 div").nth(3)).toBeVisible();
  await expect(page.locator("fd-tokenizer div").nth(3)).toContainText("کیفکفش");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page.locator(".rep-column").first().dblclick();
  await expect(page.locator("fd-tokenizer div").nth(3)).toContainText("کیفکفش");
});
