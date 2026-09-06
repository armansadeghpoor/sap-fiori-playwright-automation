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
  await page.getByRole("textbox", { name: "xxxxxxx" }).press("Enter");
  await page
    .getByRole("heading", { name: "اعتبارسنجی فیلد ها در ویرایش در لیست" })
    .click();
  await page.getByText("‫‪18‬").click();
  await page.keyboard.press("Control+A");
  await page.keyboard.press("Backspace");
  await page.getByRole("textbox").fill("15");
  await page.getByRole('button', { name: 'ویرایش در لیست' }).click();
  await page.getByRole('button', { name: 'ویرایش در لیست' }).click();
  await page.getByRole('button', { name: 'ویرایش در لیست' }).click();
  await expect(
    page.getByText(
      "اشکال در مقادیر فرم تعداد: مقدار ورودی `تعداد` نمی تواند کمتر از 18 باشد"
    )
  ).toBeVisible();
});
