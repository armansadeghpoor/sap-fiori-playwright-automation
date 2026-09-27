import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();

  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد تاریخ و زمان").click();
  await page.getByText("فیلد تاریخ-مقدار تکراری نباشد-مقدار پیش فرض").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.locator("fd-layout-grid")).toMatchAriaSnapshot(`
    - text: "تاریخ-مقدار تکراری نباشد:"
    - textbox "YYYY/MM/DD"
    - button "select day"
    - text: "تاریخ- مقدار پیش فرض:"
    - textbox "YYYY/MM/DD": ۱۳۹۸/۰۱/۰۱
    - button "select day"
    `);
});
