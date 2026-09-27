import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.user1);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند").click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("تست تایید خودکار در صورت یکسان بودن کاربر نقش").click();
  await page.getByRole("button", { name: "close", exact: true }).click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("حضور", { exact: true }).click();
  await page.getByRole("button", { name: "تایید", exact: true }).click();
});
