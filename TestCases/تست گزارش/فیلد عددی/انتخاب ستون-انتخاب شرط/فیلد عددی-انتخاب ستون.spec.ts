import { test, expect } from "@playwright/test";
import { loginAs } from "../../../../framework/auth/auth.service";
import { users } from "../../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("گزارش در فیلد عددی").click();
  await page.getByText("انتخاب ستون و انتخاب شرط").click();
  await page.getByText("فیلدعددی-انتخاب ستون", { exact: true }).click();
  await expect(
    page.getByText("جدید تعداد فرزند شماره بیمه ‫‪12‬‫‪12‬")
  ).toBeVisible();
});
