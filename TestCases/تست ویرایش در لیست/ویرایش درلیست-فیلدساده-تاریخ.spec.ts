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
  await page.getByTitle("/07/29 ").locator("div").click();
  await page.getByRole("button", { name: "select day" }).click();
  await page.getByRole("button", { name: "1398" }).click();
  await page.getByRole("button", { name: "1404" }).click();
  await page.getByRole("button", { name: "مهر" }).click();
  await page.getByRole("button", { name: "فروردین" }).click();
  await page.getByRole("button", { name: "۲۴" }).click();
  await page.getByTitle('ویرایش در لیست').click();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("bsu-barsa-table-row")).toContainText(
    "‫1404/01/24 ‬"
  );
});
