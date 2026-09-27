import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator(".fd-avatar__icon").click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("تست مخصوص وب جدید", { exact: true }).click();
  await page
    .getByRole("link", { name: "قاعده کاری در نمایش تب و صفحه" })
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.getByText("توضیحات:")).toBeVisible();
  await page.getByRole("textbox").last().click();
  await page.getByRole("textbox").last().fill("تست");
  await expect(
    page.getByText(
      "نشان داده شودعنوان:نشان داده نشودتوضیحات:عبارتهای پیش فرضدرجTo open the popup,"
    )
  ).toBeVisible();
});
