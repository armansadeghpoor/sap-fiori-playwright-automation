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
  await page
    .locator("#fd-list-item-28")
    .getByText("نمایش دکمه های غیر فرآیندی در فرم مودال")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.getByRole("group")).toBeVisible();
  await page
    .locator("fd-popover-control")
    .locator('button[fd-button][aria-label="More"][glyph="overflow"].is-cozy')
    .click();
  await expect(page.getByText("تاییدانصرافمرحله بعدی")).toBeVisible();
});
