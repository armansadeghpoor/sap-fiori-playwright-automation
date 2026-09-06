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
  await page.getByText("تست وب جدید").click();
  await page.getByText("تست اعداد اعشاری و صحیح").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عدد صحیح:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عدد صحیح:" })
    .getByRole("textbox")
    .fill("23,6523");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عدد صحیح:" })
    .getByRole("textbox")
    .press("Tab");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عدد اعشاری-4 رقم اعشار:" })
    .getByRole("textbox")
    .fill("231.65485");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عدد اعشاری-4 رقم اعشار:" })
    .getByRole("textbox")
    .press("Tab");
  await page
    .locator("bsu-ui-num-decimal-ui")
    .getByRole("textbox")
    .fill("123,456.12346");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  // await page.getByRole("button", { name: "" }).click();
  await page.getByRole('link', { name: '‫‪236,523‬' }).dblclick();
  await expect(
    page
      .locator("bsu-layout-control")
      .filter({ hasText: "عدد صحیح:" })
      .getByRole("textbox")
  ).toHaveValue("236,523");
  await expect(
    page
      .locator("bsu-layout-control")
      .filter({ hasText: "عدد اعشاری-4 رقم اعشار:" })
      .getByRole("textbox")
  ).toHaveValue("231.6548");
  await expect(
    page.locator("bsu-ui-num-decimal-ui").getByRole("textbox")
  ).toHaveValue("123,456.1234");
  await page.getByTitle('Close').click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عدد صحیح:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عدد صحیح:" })
    .getByRole("textbox")
    .fill("12,3362");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عدد صحیح:" })
    .getByRole("textbox")
    .press("Tab");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عدد اعشاری-4 رقم اعشار:" })
    .getByRole("textbox")
    .fill("123");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عدد اعشاری-4 رقم اعشار:" })
    .getByRole("textbox")
    .press("Tab");
  await page.locator("bsu-ui-num-decimal-ui").getByRole("textbox").fill("123");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole('link', { name: '‫‪123,362‬' }).dblclick();
  await expect(
    page
      .locator("bsu-layout-control")
      .filter({ hasText: "عدد صحیح:" })
      .getByRole("textbox")
  ).toHaveValue("123,362");
  await expect(
    page
      .locator("bsu-layout-control")
      .filter({ hasText: "عدد اعشاری-4 رقم اعشار:" })
      .getByRole("textbox")
  ).toHaveValue("123");
  await expect(
    page.locator("bsu-ui-num-decimal-ui").getByRole("textbox")
  ).toHaveValue("123.0000");
});
