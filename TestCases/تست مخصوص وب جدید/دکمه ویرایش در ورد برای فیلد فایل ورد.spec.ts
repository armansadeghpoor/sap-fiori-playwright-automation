import { test, expect } from "@playwright/test";
import path from "path";

test("test", async ({
  page,
}) => {
  // فایل و مسیر ویندوزی
  const filePath = path.resolve(
    "D:/NewWeb UiTest",
    "موارد سیستم حضور غیاب(صادق پور).docx"
  );

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
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("دکمه ویرایش در ورد برای فیلد فایل ورد").click();
  await page.getByText("‫*حذف نشود*‬").dblclick();
  await page.getByRole('button', { name: 'ویرایش', exact: true }).click();
  await page.getByTitle('Close').click();
  await page.getByRole("button", { name: "جدید" }).click();

  await page.locator('input[type="file"]').setInputFiles(filePath);

  await expect(page.getByRole('button', { name: 'ویرایش', exact: true })).toBeVisible();
});
