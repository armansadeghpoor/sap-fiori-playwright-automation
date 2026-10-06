import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.user1);
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "بازآوری ساختار" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند").click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("فرآیند-فرم-تنظیمات فعالیت فرم-عنوان بدون متن").click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("اردبیل");
  await page.getByRole("button", { name: "تایید" }).click();
});
