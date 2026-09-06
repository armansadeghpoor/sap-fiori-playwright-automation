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
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("تست مخصوص وب جدید", { exact: true }).click();
  // await page.getByTitle("سیستم تست وب جدید").click();
  await page.getByRole("link", { name: "رفتار لیست خطی با Enter" }).click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox", { name: "Multi Value Input" }).click();
  await page.getByRole("textbox", { name: "Multi Value Input" }).fill("تست");
  await page
    .getByRole("textbox", { name: "Multi Value Input" })
    .press("ArrowDown");
  await page.getByRole("option", { name: "تست 1", exact: true }).press("Enter");
  await page.getByRole("textbox", { name: "Multi Value Input" }).fill("تست");
  await page
    .getByRole("textbox", { name: "Multi Value Input" })
    .press("ArrowDown");
  await page.getByRole("option", { name: "تست 2", exact: true }).press("Enter");
  await page.getByRole("textbox", { name: "Multi Value Input" }).fill("تست");
  await page
    .getByRole("textbox", { name: "Multi Value Input" })
    .press("ArrowDown");
  await page
    .getByRole("option", { name: "تست 3", exact: true })
    .press("Escape");
  await expect(page.locator("fd-multi-input")).toContainText("تست 1تست 2");
});
