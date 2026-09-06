import { test, expect } from "@playwright/test";

test.use({
  storageState: "localstorage.json",
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
  await page.getByRole("textbox", { name: "xxxxxxx" }).press("Enter");
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await page.waitForTimeout(1000);
  await page.locator('li[data-name="سیستم تست کاربران"]').click();
  await expect(page.getByText("سیستم سیستم تست کاربران")).toBeVisible();
  await page.getByRole("link").nth(2).click();
  await expect(page.getByText("سیستم تست کد")).toBeVisible();
  await page.getByRole("link").nth(9).click();
  await expect(page.getByText("سیستم تست ابزار")).toBeVisible();
});
