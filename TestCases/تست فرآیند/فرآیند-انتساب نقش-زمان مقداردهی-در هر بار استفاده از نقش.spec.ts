import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  test.setTimeout(80000);
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
  await page.getByText("انتساب نقش-در هر استفاده از نقش").click();
  await page.getByTitle("نما").getByRole("textbox").click();
  await page.getByTitle("نما").getByRole("textbox").fill("سمنان");
  await page.getByRole("button", { name: "تایید" }).click();
  await page.locator("#fd-avatar-0").click();
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
    .fill("راهبر");
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
  await page.getByText("انتساب نقش-هربار استفاده از نفش").click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByTitle("نما").getByRole("textbox").click();
  await page.getByTitle("نما").getByRole("textbox").fill("55");
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
    .fill("کاربر2");
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
  await page.getByText("انتساب نقش-هربار استفاده از نفش").click();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("bsu-ly-horizontal-layout")).toContainText(
    "نما3اسم شهر:سمناناسم خیابان:55"
  );
  await page.getByRole("button", { name: "تایید" }).click();
});
