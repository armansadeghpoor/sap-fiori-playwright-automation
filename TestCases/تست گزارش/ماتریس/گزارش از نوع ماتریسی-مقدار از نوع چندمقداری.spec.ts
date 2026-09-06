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
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByRole("listitem").filter({ hasText: "تست گزارش" }).click();
  await page.waitForTimeout(500);
  await page.getByTitle("تست گزارش از نوع گانت").first().click();
  await page
    .getByRole("link", {
      name: "تست گزارش از نوع ماتریسی-مقدار از نوع چندمقداری",
    })
    .click();
  await page.locator("fd-popover-control > span").first().click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("پروژه").click();
  await page
    .locator(
      "#fd-popover-34 > .fd-popover__control > fd-popover-control > span"
    )
    .click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("زیرساخت").click();
  await page.getByRole("button", { name: "ذخیره" }).click();
  await page.reload();
  await expect(page.locator(".viewer-container")).toBeVisible();
  await expect(
    page.getByText(
      "جدید ذخیره شیفت صبح شیفت ظهر شیفت عصر شیفت شب شنبهپروژهیکشنبهدوشنبهسه شنبهچهارشن"
    )
  ).toBeVisible();
});
