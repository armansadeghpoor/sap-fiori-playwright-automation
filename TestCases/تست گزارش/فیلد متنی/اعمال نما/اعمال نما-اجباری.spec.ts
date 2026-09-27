import { test, expect } from "@playwright/test";
import { loginAs } from "../../../../framework/auth/auth.service";
import { users } from "../../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("گزارش در فیلد متنی").click();
  await page.getByText("اعمال نما").click();
  await page.getByText("فیلد متنی-بررسی نما-با حالت اجباری").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تهران");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
