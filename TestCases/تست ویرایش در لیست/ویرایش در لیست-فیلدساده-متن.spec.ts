import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("ویرایش در لیست", { exact: true }).click();
  await page.getByText("انواع فیلد").click();
  await page.getByText("فیلدهای نوع ساده").click();
  await page.getByTitle("سارا").locator("div").click();
  await page.getByRole("textbox", { name: "سارا" }).fill("سارا تست");
  await page.getByTitle('ویرایش در لیست').click();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("bsu-barsa-table-row")).toContainText("‫سارا تست‬");
});
