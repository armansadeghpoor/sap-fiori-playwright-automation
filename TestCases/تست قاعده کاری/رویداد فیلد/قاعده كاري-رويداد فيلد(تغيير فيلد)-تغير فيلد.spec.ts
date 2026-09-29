import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../framework/api/environment.api";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست قاعده کاری").click();
  await page.getByText("رویداد فیلد").click();
  await page
    .getByText("قاعده کاری-رویداد فیلد(تغییر فیلد))-عملیات تغییر فیلد")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان سمت:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان سمت:" })
    .getByRole("textbox")
    .fill("تست");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .fill("آنا");
  await expect(page.getByRole("textbox", { name: "تست" })).toHaveValue("تست");
  await page.getByRole("textbox", { name: "تست" }).click();
  await page.getByRole("textbox", { name: "تست" }).click();
  await page.getByRole("textbox", { name: "تست" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
