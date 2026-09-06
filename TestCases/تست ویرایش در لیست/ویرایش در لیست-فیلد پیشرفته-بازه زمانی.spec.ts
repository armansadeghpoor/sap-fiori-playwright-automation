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
    .fill("راهبر");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .press("Tab");
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("button", { name: "ورود" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText('ویرایش در لیست', { exact: true }).click();
  await page.getByText("انواع فیلد").click();
  await page.getByText("ویرایش در لیست-فیلد پیشرفته").click();
  await page.getByTitle(":32").locator("div").click();
  await page.getByRole("textbox").press("ArrowRight");
  await page.getByRole("textbox").press("ArrowRight");
  await page.getByRole("textbox").press("ArrowLeft");
  await page.getByRole("textbox").fill("95.2");
  await page.getByRole("textbox").press("ArrowLeft");
  await page.getByRole("textbox").fill("95.290");
  await page
    .locator("fd-dynamic-page-content div")
    .filter({ hasText: "جدید بازه زمانی ‫15:00‬" })
    .click();
  await page.getByTitle(":00").locator("div").click();
  await page.getByTitle("95.29").locator("div").click();
  await page.getByTitle(":00").locator("div").click();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("tbody")).toContainText("‫95:29‬");
});
