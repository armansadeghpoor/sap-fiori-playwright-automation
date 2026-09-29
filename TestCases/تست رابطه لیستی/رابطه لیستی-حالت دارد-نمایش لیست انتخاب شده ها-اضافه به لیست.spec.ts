import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه لیستی").click();
  await page.getByText("فیلد رابطه لیستی-رابطه دارد-انواع نمایش").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole('button', { name: 'اضافه به لیست' }).click();
  await page
    .getByRole("row", { name: "‫کاشان‬" })
    .locator("label span")
    .click();
  await page
    .getByRole("row", { name: "‫تهران‬" })
    .locator("label span")
    .click();
  await page.getByRole("button", { name: "تایید" }).click();
  await expect(page.locator('[id="گروه"]')).toContainText('جدیداضافه به لیستحذف از لیست شهر ‫کاشان‬‫تهران‬');
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
