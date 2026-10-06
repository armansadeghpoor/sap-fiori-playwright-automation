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
  await page.getByRole("cell", { name: "‫صورتی‬" }).click();
  await page
    .getByRole("cell", { name: "صورتی Select Options" })
    .getByLabel("Select Options")
    .click();
  await page.getByText("سیاه").click();
  await page.getByTitle('ویرایش در لیست').click();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("bsu-barsa-table-row")).toContainText("‫سیاه‬");
});
