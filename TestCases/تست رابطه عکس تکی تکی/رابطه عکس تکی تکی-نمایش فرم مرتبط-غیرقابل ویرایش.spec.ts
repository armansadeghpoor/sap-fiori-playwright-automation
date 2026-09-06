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
  await page.getByText("رابطه عکس تکی تکی").click();
  await page
    .getByText(
      "رابطه عکس تکی(تکی)-خوابگاه-نمایش لیست ساده-فرم مرتبط غیرقابل ویرایش-نمایش آیکون "
    )
    .click();
  await page
    .getByRole("row", { name: "‫شاهد‬ ‫نیمه خصوصی‬ ‫1‬ " })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("fd-dynamic-page-content")).toContainText("نام:1");
  await page.getByTitle('Close').click();
});
