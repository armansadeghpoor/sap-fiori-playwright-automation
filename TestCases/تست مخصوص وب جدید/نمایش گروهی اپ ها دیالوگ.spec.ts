import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("heading", { name: "نمایش گروهی اپ ها دیالوگ" }).click();
  await expect(
    page.getByRole("heading", { name: "دانلود فایل در موبایل" }),
  ).toBeVisible();
  await page.getByRole("heading", { name: "دانلود فایل در موبایل" }).click();
  await expect(
    page.getByLabel("Breadcrumb Trail").getByText("دانلود فایل در موبایل"),
  ).toBeVisible();
});
