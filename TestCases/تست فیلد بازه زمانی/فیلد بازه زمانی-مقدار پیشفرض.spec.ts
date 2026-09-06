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
  await page.getByRole("textbox", { name: "xxxxxxx" }).click();
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("button", { name: "ورود" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست فیلد").click();
  await page
    .locator("bsu-barsa-tree-item li")
    .getByText("فیلد های نوع پیشرفته")
    .click();
  await page
    .locator("bsu-barsa-tree-item li")
    .getByText("فیلد بازه زمانی")
    .click();
  await page
    .getByText(
      "فیلد بازه زمانی-نمایش زمان-تکراری نباشد-غیرقابل ویرایش-مقدار پیش فرض"
    )
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(
    page
      .locator("bsu-layout-control")
      .filter({ hasText: "مقدار پیش فرض:" })
      .getByRole("textbox")
  ).toHaveValue("10.10");
});
