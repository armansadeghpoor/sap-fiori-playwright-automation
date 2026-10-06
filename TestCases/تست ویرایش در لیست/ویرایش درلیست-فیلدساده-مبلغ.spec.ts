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
  await page.getByTitle("تومان").locator("div").click();
  await page.getByRole("cell", { name: "4,536" }).getByRole("textbox").click();
  await page
    .getByRole("cell", { name: "4,536" })
    .getByRole("textbox")
    .fill("4,5366");
  await page.getByTitle('ویرایش در لیست').click();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("bsu-barsa-table-row")).toContainText(
    "‫45,366 تومان‬"
  );
  await page
    .locator("fd-dynamic-page-content div")
    .filter({
      hasText:
        "جدید ویراش در لیست-متن ویراش در لیست-عدد ویراش در لیست-درست/نادرست ویراش در لیست",
    })
    .click();
});
