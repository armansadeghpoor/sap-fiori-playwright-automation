import { test, expect, devices } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";
test.use({
  ...devices["Pixel 7"],
});
test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("فایل-لیست خطی-انتخاب چند نوع").click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByText("لایسنس سرور.pdf").click();
  await page.getByRole("button", { name: "" }).click();
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "close", exact: true }).click();
  await page.getByText("word.pdf").click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: "close", exact: true }).click();
});
