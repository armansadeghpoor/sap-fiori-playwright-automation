import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page
    .getByRole("heading", { name: "نمایش دکمه ها در اورفلو فرم" })
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  const formToolbar = page.locator('bsu-form-toolbar');
  await expect(formToolbar).toContainText('دستور تست 1دستور تست 2دستور تست 3دستور تست 4دستور تست 5دستور تست 6دستور تست 7دستور تست 8دستور تست 9دستور تست 10 ذخیره');
  await page.getByRole("button", { name: "More" }).click();
  await expect(page.getByText('ذخیره و جدید')).toBeVisible();
});
