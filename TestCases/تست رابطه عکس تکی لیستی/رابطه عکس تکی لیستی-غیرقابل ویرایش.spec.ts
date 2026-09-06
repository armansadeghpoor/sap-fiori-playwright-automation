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
