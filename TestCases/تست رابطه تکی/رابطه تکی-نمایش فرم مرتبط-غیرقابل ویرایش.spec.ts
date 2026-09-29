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
  await page
    .locator("bsu-layout-control", {
      hasText: "نمابش فرم مرتبط-غیرقابل ویرایش",
    })
    .getByRole("combobox")
    .click();
  await page.locator("#fd-input-group-button-id-1").click();
  await page.getByText("بنفش").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole('link', { name: '‫بنفش‬' }).dblclick();
  await page.getByRole('button', { name: 'navigation-down-arrow' }).nth(1).click();
  await expect(page.locator('fd-popover-body').last()).toContainText('زرد32 سفید تست بنفش صورتی سرمه ای سرمه ای سرمه ای');
  await page.getByTitle('Close').click();
});
