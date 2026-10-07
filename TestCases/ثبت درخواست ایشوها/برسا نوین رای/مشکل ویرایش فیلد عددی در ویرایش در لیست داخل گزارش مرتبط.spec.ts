import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../framework/api/environment.api";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("ثبت درخواست ایشوها").last().click();
  await page
    .getByRole("link", {
      name: "مشکل ویرایش فیلد عددی در ویرایش در لیست داخل گزارش مرتبط",
    }).last()
    .click();
  await page.getByText("‫‪155‬").click();
  await page.locator('bsu-ui-num-int-ui').getByRole('textbox').click();
  await page.locator('bsu-ui-num-int-ui').getByRole('textbox').fill("");
  await page.getByRole("cell").nth(2).click();
  await page.locator("#LayoutItem_5").getByRole("textbox").click();
  await page.locator("#LayoutItem_5").getByRole("textbox").fill("155.355");
  await page.getByTitle("ویرایش در لیست", { exact: true }).click();
  await expect(page.getByText("‫155.35‬")).toBeVisible();
});
