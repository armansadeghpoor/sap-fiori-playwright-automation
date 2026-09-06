import { test, expect } from "@playwright/test";

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
  await page.getByRole("button", { name: "ورود" }).click();
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page
    .getByRole("listitem")
    .filter({ has: page.getByText("تست مخصوص وب جدید", { exact: true }) })
    .click();
  await page.getByTitle("سیستم تست وب جدید").click();
  await page.getByRole("link", { name: "نشانه گذاری متن پیشرفته" }).click();
  await page.getByRole("cell", { name: "" }).click();
  await expect(
    page
      .locator('iframe[title="Rich Text Area"]')
      .contentFrame()
      .locator("html"),
  ).toContainText("تست نقطهاندرلاینتست شمارهایتالیکتست بولد");
  await page.getByRole("tab", { name: "غیرقابل ویرایش default" }).click();
  await expect(page.locator("bsu-ui-tinymce")).toContainText(
    "تست نقطه اندرلاین تست شماره تست ایتالیک تست بولد",
  );
  await expect(page.locator("bsu-ui-tinymce")).toContainText(
    "تست نقطه اندرلاین",
  );
  await expect(page.locator("ol")).toContainText(
    "تست شماره تست ایتالیک تست بولد",
  );
  await page.waitForTimeout(2000);
});
