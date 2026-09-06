import { test, expect } from "@playwright/test";
test.setTimeout(45000);
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
  await page.getByText("متغیر گردش").click();
  await page.getByText("فرم-حالت عدم دسترسی -نمای جاری فرم").click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("اجرای فرآیندها").click();
  await page
    .getByText("انجام فرم-حالت عدم دسترسی-نمای فعالیت جاری فرم")
    .click();
  await page.getByRole("button", { name: "close", exact: true }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .fill("تست");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام خانوادگی:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام خانوادگی:" })
    .getByRole("textbox")
    .fill("تست");
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "" }).click();
  await page
    .getByRole("row", { name: "‫تست‬ ‫تست‬ " })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "تایید" }).click();
});
