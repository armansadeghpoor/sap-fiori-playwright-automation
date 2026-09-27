import { test, expect, devices } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  ...devices["Pixel 7"],
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("tab", { name: "تست موبایل-تایل default" }).click();
  await page
    .getByRole("heading", { name: "نمایش دکمه ها در اورفلو فرم" })
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.locator("fd-dynamic-page-header")).toContainText(
    "نمایش دکمه ها در اورفلو فرم دستور تست 1",
  );
  await page.getByRole("button", { name: "More" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "دستور تست 2دستور تست 3دستور تست 4دستور تست 5دستور تست 6دستور تست 7دستور تست 8دستور تست 9دستور تست 10 ذخیره",
  );
});
