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
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه عکس تکی تکی").click();
  await page.getByText("رابطه تکی-دانشجو-انتخاب خوابگاه و رشته ورزشی").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("4");
  await page.getByRole("textbox").press("Tab");
  await page.locator("#fd-input-group-button-id-0").click();
  await page.getByText("دو میدانی").click();
  await page.locator("#fd-input-group-button-id-1").click();
  await page.getByText("فرزانگان").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page
      .getByRole("row", { name: "‫4‬ ‫دو میدانی‬ ‫فرزانگان‬ " })
      .getByRole("cell")
      .first()
  ).toBeVisible();
});
