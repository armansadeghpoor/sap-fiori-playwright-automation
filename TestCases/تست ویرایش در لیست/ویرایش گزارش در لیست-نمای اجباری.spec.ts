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
  await page.getByText("ویرایش در لیست", { exact: true }).click();
  await page.getByText("انواع فیلد").click();
  await page.getByText("نما با قابلیت اجباری").click();
  await page.getByTitle("فرو").locator("div").click();
  await page.waitForTimeout(1000);
  await page.getByRole("textbox", { name: "فرو" }).fill("");
  await page
    .locator("fd-dynamic-page-content div")
    .filter({ hasText: "جدید نام ‫آوا‬‫سارا‬‫شهاب‬" })
    .click();
  await page.getByRole("button", { name: "" }).click();
  await expect(
    page.getByRole("cell", { name: "" }).locator("fd-icon")
  ).toBeVisible();
  await page.getByTitle("فرو").locator("div").click();
  await page.waitForTimeout(1000);
  await page.getByRole("textbox", { name: "فرو" }).fill("");
  await page.getByRole("textbox", { name: "" }).fill("فرو");
  await expect(page.getByRole("cell", { name: "" })).toBeVisible();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("tbody")).toContainText("‫فرو‬");
});
