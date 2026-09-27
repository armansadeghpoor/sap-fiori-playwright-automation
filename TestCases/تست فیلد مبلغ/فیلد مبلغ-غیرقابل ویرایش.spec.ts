import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد مبلغ").click();
  await page.getByText("مبلغ-ریال-انواع مشخصات").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.locator("bsu-ly-vertical-layout")).toMatchAriaSnapshot(`
    - text: "مبلغ-ریال-غیرقابل ویرایش:"
    - paragraph
    `);
});
