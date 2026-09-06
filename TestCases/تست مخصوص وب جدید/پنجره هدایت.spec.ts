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
  await page.getByRole("link", { name: "تست پنجره هدایت" }).click();
  await expect(page.locator("bsu-barsa-ulv-main")).toBeVisible();
  await page.getByText("‫تست 1‬").click();
  await page.locator(".fd-shellbar").click();
  await expect(
    page.locator("bsu-barsa-ulv-main").filter({ hasText: "جدید شماره ‫‪11‬" }),
  ).toBeVisible();
  await page.getByText("‫تست 2‬").click();
  await expect(
    page.locator("bsu-barsa-ulv-main").filter({ hasText: "جدید شماره ‫‪22‬" }),
  ).toBeVisible();
  await page.getByText("‫تست 3‬").click();
  await expect(
    page.locator("bsu-barsa-ulv-main").filter({ hasText: "جدید شماره ‫‪33‬" }),
  ).toBeVisible();
});
