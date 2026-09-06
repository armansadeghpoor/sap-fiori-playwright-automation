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
  await page.getByRole("textbox", { name: "xxxxxxx" }).press("Enter");
  await page.locator(".fd-avatar__icon").click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("تست مخصوص وب جدید", { exact: true }).click();
  await page
    .getByRole("link", { name: "قاعده کاری در نمایش تب و صفحه" })
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.getByText("توضیحات:")).toBeVisible();
  await page.getByRole("textbox").last().click();
  await page.getByRole("textbox").last().fill("تست");
  await expect(
    page.getByText(
      "نشان داده شودعنوان:نشان داده نشودتوضیحات:عبارتهای پیش فرضدرجTo open the popup,"
    )
  ).toBeVisible();
});
