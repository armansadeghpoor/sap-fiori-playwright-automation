import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  test.setTimeout(45000);
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
    .fill("کاربر1");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .press("Tab");
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("button", { name: "ورود" }).click();
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "بازآوری ساختار" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند").click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("حذف اشیا و فرم مرتبط با حذف فرم").click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").nth(0).fill("تست");
  await page.getByRole("textbox").press("Tab");
  await page.getByRole("spinbutton").fill("111");
  await page.getByRole("button", { name: " ذخیره", exact: true }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("تنظیمات فرم").click();
  await page.getByText("حذف اشیا مرتبط و فرآیند با حذف فرم").click();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("bsu-ui-table-view")).toContainText(
    "نام شماره ‫تست‬‫‪111‬"
  );
});
