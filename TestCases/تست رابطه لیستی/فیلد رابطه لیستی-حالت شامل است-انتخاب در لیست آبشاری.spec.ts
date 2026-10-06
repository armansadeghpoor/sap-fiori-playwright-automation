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
  await page.getByText("رابطه لیستی(شامل است) (انتخاب در لیست آبشاری)").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("bsu-ui-text-field").getByRole("textbox").click();
  await page.locator("bsu-ui-text-field").getByRole("textbox").fill("تست");
  await page.locator("bsu-ui-text-field").getByRole("textbox").press("Tab");
  await page.locator("bsu-ui-num-int-ui").getByRole("textbox").fill("01");
  await page.getByRole("button", { name: "value-help" }).click();
  await page.getByRole("option", { name: "آبی" }).locator("label span").click();
  await page.getByRole("option", { name: "زرد" }).locator("label span").click();
  await page.getByRole("option", { name: "سبز" }).locator("label span").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('link', { name: '‫تست‬' }).dblclick();
  await expect(page.locator("fd-tokenizer")).toContainText("آبیزردسبز");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
