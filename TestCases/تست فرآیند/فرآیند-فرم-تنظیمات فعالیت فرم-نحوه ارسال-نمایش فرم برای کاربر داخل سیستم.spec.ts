import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.user1);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند" , {exact:true}).click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("فرم-بررسی نمای اعمال شده به فرم").click();
  await page.getByText("فرم-بررسی نمای اعمال شده به فرم").click();
  await page.locator("div").filter({ hasText: "نما1سن:نام:" }).nth(3).click();
});
