import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page
    .getByRole("heading", { name: "پریدن صفحه بندی بعد از رفرش" })
    .click();
  await page.getByTitle('Close').click();
  await expect(page.getByRole("tablist")).toContainText(
    "تست مخصوص وب جدید - تایل default"
  );
});
