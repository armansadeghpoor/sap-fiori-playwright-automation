import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  test.setTimeout(70000);
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
    .fill("کاربر2");
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
  await page.getByText("تست فرآیند", { exact: true }).click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("انتساب نقش -محاسباتی-گزارش-فیلد فرم").click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await page.getByRole("textbox").press("Tab");
  await page.getByRole("spinbutton").fill("14");
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("کاربر1").click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.locator("#fd-avatar-0 fd-icon").click();
  await page.getByRole("menuitem", { name: "خروج" }).click();
  await page.getByRole("button", { name: "بله" }).click();
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
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند", { exact: true }).click();
  await page.getByText("نقشها").click();
  await page.getByText("انتساب نقش محاسباتی-گزارش-فیلد فرم").click();
  await page
    .getByRole("row", { name: "‫تست‬ ‫‪14‬ ‫کاربر1‬ " })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "تایید", exact: true }).click();
  await page
    .getByRole("row", { name: "‫تست‬ ‫‪14‬ ‫کاربر1‬ " })
    .getByRole("button")
    .click();
});
