import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("عدم وجود کادر در فیلد فقط خواندنی").click();
  await page.getByRole('link', { name: '‫تست 1‬' }).dblclick();
  await expect(page.locator("bsu-ly-vertical-layout")).toMatchAriaSnapshot(
    `- paragraph: تست 1`
  );
  await expect(page.locator("bsu-ly-vertical-layout")).toMatchAriaSnapshot(
    `- paragraph: تست 2`
  );
  await page.waitForTimeout(3000);
});
