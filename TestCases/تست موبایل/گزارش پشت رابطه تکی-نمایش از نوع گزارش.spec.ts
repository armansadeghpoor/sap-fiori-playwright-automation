import { test, expect, devices } from "@playwright/test";
test.use({
  ...devices["Pixel 7"],
});
test.use({
  storageState: "localstorage.json",
});

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
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();

  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator('li[data-name="تست مخصوص وب جدید"]').click();
  // await page.getByTitle("سیستم تست وب جدید").click();

  await page
    .getByRole("link", { name: "گزارش پشت رابطه تکی-نمایش از نوع گزارش" })
    .click();
  
  await page.getByText('*حذف نشود*').dblclick();
  await page.getByRole("combobox", { name: "انتخاب کنید" }).click();
  await page.getByRole("combobox", { name: "انتخاب کنید" }).fill("تست 1");
  await page.keyboard.press("Backspace");
  await expect(
    page
      .getByRole("dialog")
      .locator("div")
      .filter({ hasText: "تست 1 تست 2 تست 3 تست 4 تست 5" }),
  ).toBeVisible();
  await page
    .locator('button[fd-button][fdtype="transparent"][glyph="search"]')
    .click();
  await expect(
    page.getByText("ابتدا فیلتر را تنظیم کنید و جستجو نمایید"),
  ).toBeVisible();
  await page.getByRole("button", { name: "close", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "*حذف نشود*" })).toBeVisible();
});
