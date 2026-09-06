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

  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد مبلغ").click();
  await page.getByText("مبلغ-ریال-انواع مشخصات").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "مبلغ-ریال-مقدار تکراری نباشد-جدا کننده اعداد 3 رقم:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "مبلغ-ریال-مقدار تکراری نباشد-جدا کننده اعداد 3 رقم:" })
    .getByRole("textbox")
    .fill("12,0000");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "مبلغ-ریال-مقدار تکراری نباشد-جدا کننده اعداد 3 رقم:" })
    .getByRole("textbox")
    .click();
  await page.waitForTimeout(2000);
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "مبلغ-ریال-مقدار تکراری نباشد-جدا کننده اعداد 3 رقم:" })
    .getByRole("textbox")
    .fill("12,0000");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.getByText(
      "مقدار فیلد 'مبلغ-ریال-انواع مشخصات.مبلغ-ریال-مقدار تکراری نباشد-جدا کننده اعداد "
    )
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
