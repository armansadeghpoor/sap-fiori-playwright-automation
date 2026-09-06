import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot",
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
  await page.getByText("تست وب جدید").click();
  await page.getByText("گزارشات از نوع نقشه").click();
  await page.getByRole("button", { name: "جستجو" }).click();
  await page.locator('button:has(.sap-icon--table-view)').click();
  await page.getByRole("menuitem").nth(1).click();
  await page.locator("bsu-ui-map-report div").first().click();
  await page
    .locator("div")
    .filter({ hasText: "+− OpenStreetMap" })
    .nth(3)
    .click();
  await page.mouse.down({ button: "left" });
  await page.waitForTimeout(1000);
  await page
    .locator("fd-popover-body ul li")
    .getByRole("button")
    .getByText("جدید")
    .click();

  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان:" })
    .getByRole("textbox")
    .fill("تست");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
