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
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("گزارش در فیلد متنی").click();
  await page.getByText("اعمال نما").click();
  await page
    .getByText("فیلد متنی-بررسی نما-همه حالت ها به جز حالت اجباری")
    .click();
  //   await page.getByRole("button", { name: "Navigation" }).click();
  //   await page.locator(".sidemenu-h.tw-fixed.tw-right-0").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "سمت(مشاهده-ویرایش):" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "سمت(مشاهده-ویرایش):" })
    .getByRole("textbox")
    .fill("کارشناس");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
