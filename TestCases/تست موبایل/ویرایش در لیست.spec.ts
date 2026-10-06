import { test, expect, devices } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  ...devices["Pixel 7"],
});

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("ویرایش در لیست", { exact: true }).click();
  await page.getByText("انواع فیلد").click();
  await page.getByText("فیلدهای نوع ساده").click();
  await page.getByTitle("سارا").first().click();
  await page.getByRole("textbox", { name: "سارا" }).fill("موبایل");
  await page.getByRole("button", { name: "ویرایش در لیست" }).click();
  await page.getByRole('button', { name: 'More' }).click();
  await page.getByRole("button", { name: "بازآوری" }).click();
  await expect(page.locator("bsu-barsa-table-row")).toContainText("موبایل");
});
