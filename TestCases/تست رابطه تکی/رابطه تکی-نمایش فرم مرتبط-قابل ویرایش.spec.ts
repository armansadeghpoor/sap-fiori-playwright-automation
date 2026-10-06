import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه تکی").click();
  await page.getByText("رابطه تکی-نمایش فرم مرتبط").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("#fd-input-group-button-id-0").click();
  await page.locator("li").getByText("سفید تست").click();
  await page.getByRole('button', { name: 'ویرایش', exact: true }).click();
  await page.getByRole("textbox", { name: "سفید" }).click();
  await page.getByRole("textbox", { name: "سفید" }).fill("سفید تست");
  await expect(page.locator("fd-layout-grid")).toMatchAriaSnapshot(`
    - img
    - text: "رنگ:"
    - textbox "سفید تست"
    `);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("tbody")).toContainText("‫سفید تست‬");
});
