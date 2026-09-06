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
  await page.getByText("رویداد فرم").click();
  await page
    .getByText(
      "قاعده کاری-رویداد فرم(بعد از باز شدن فرم)-عملیات نمایش پیغام خطا"
    )
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  // await expect(page.locator("label")).toContainText(
  //   "فیلد عنوان شهر مقدار ندارد"
  // );
  await expect(page.getByText("فیلد عنوان شهر مقدار ندارد")).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page
    .getByText("قاعده کاری-رویداد فرم(بعد از باز شدن فرم)-اعمال نما")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان جلسه:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان جلسه:" })
    .getByRole("textbox")
    .fill("سیستم آموزش");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان جلسه:" })
    .getByRole("textbox")
    .press("Tab");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "دبیرجلسه:" })
    .getByRole("textbox")
    .fill("کرمی");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page
    .locator("span.ellapsis")
    .getByText(
      "قاعده کاری-رویداد فرم(بعد از باز شدن فرم)-عملیات نمایش پیغام خطا",
      { exact: true }
    )
    .click();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.getByText("عنوان جلسه مقدار دارد")).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
