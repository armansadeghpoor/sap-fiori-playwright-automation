import { test, expect, devices } from "@playwright/test";
test.use({
  ...devices["Pixel 7"],
});
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
  await page.getByText("تست وب جدید").click();
  await page.getByText("فایل-لیست خطی-انتخاب چند نوع").click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByText("لایسنس سرور.pdf").click();
  await page.getByRole("button", { name: "" }).click();
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "close", exact: true }).click();
  await page.getByText("word.pdf").click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: "close", exact: true }).click();
});
