import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page
    .getByRole("heading", { name: "نمایش دکمه های غیر فرآیندی در فرم مودال" })
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.getByText("تاییدانصرافمرحله بعدی ذخیره")).toBeVisible();
});
