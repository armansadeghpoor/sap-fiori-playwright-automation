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
  await page.getByText("تست قاعده کاری").click();
  await page.getByText("رویداد فیلد").click();
  await page
    .getByText(
      "قاعده کاری-رویداد فیلد(تغییر فیلد و ابتدای باز شدن فرم)-عملبات نمایش پیغام"
    )
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان کالا:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان کالا:" })
    .getByRole("textbox")
    .fill("کتا");
  // await expect(page.locator("#cdk-overlay-2")).toContainText("اطلاعات");
  await expect(page.locator('#cdk-overlay-1')).toContainText('اطلاعات');
  await expect(page.locator('#cdk-overlay-1')).toContainText(
    'عنوان کالا نباید شامل کاراکتر "الف" باشد'
  );
  await page.locator('button[fd-dialog-decisive-button]', { hasText: 'تایید' }).first().click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("textbox", { name: "کتا" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
