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
  await page.locator("bsu-barsa-tree-item li").getByText("تست کد").click();
  await page.locator("bsu-barsa-tree-item li").getByText("MoList").click();
  await page.getByText("تست گزارش مرتبط و رابطه لیستی").click();
  await page.getByRole("button", { name: "" }).click();
  // await page.locator("tbody").getByTitle("1").locator("div").click();
  await page.getByRole('cell').nth(4).click();
  await page.waitForTimeout(1000);
  await page
    .getByRole("button", { name: "افزودن به رابطه لیستی از طریق گزارش مرتبط" })
    .click();
  await expect(page.locator('bsu-ui-ulv-main-ui').filter({ hasText: 'جدیداضافه به لیستحذف از لیست عنوان ‫1‬' })).toBeVisible();
  await page.waitForTimeout(500);[]
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("bsu-column-renderer")).toMatchAriaSnapshot(
    `- text: ‫1‬`
  );
});
