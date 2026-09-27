import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";
import path from "path";

test("test", async ({
  page,
}) => {
  // فایل و مسیر ویندوزی
  const filePath = path.resolve(
    "D:/NewWeb UiTest",
    "موارد سیستم حضور غیاب(صادق پور).docx"
  );

  await loginAs(page, users.rahbar);
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
