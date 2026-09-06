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
  await page.getByText("تست فرآیند", {exact:true}).click();
  await page.getByText("محل باز شدن فرم").click();
  await page.getByText("پاس دادن فرم به فرآیند-گزارش").click();
  await page
    .getByRole("row", { name: "‫کتاب‬ ‫‪6‬ " })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "اجرای فرآیند" }).click();
  await page.getByRole("button", { name: "ok" }).click();
});
