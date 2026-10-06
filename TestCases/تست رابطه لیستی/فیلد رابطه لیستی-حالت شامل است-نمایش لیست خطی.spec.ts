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
  await page.getByText("رابطه لیستی").click();
  await page.getByText("فیلد رابطه لیستی-رابطه دارد-انواع نمایش").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("fd-input-group div span")
    .getByRole("button")
    .nth(1)
    .click();
  await page.getByRole("option", { name: "کیف" }).locator("label span").click();
  await page.locator("fd-tokenizer div input").nth(1).click();
  await page.locator("fd-tokenizer div input").nth(1).fill("کف");
  await page.getByRole("option", { name: "کفش" }).locator("label span").click();
  await page.locator("fd-tokenizer div input").nth(1).click();
  await page.locator("fd-tokenizer div input").nth(1).fill("");
  // await expect(page.locator("#fd-popover-9 div").nth(3)).toBeVisible();
  await expect(page.locator("fd-tokenizer div").nth(3)).toContainText("کیفکفش");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page.locator(".rep-column").first().dblclick();
  await expect(page.locator("fd-tokenizer div").nth(3)).toContainText("کیفکفش");
});
