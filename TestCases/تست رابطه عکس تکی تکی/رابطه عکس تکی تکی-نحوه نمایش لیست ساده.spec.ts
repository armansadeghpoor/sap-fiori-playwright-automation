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
  await page.getByText("رابطه عکس تکی تکی").click();
  await page.getByText("رابطه تکی-دانشجو-انتخاب خوابگاه و رشته ورزشی").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("4");
  await page.getByRole("textbox").press("Tab");
  await page.locator('fd-input-group span').getByRole('button').first().click();
  await page.getByText("دو میدانی").click();
  await page.locator('fd-input-group span').getByRole('button').nth(1).click();
  await page.getByText("فرزانگان").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole('link', { name: '‫نرگس‬' }).click();
  await expect(page.locator('bsu-ui-grid')).toContainText('نام انتخاب رشته ورزشی انتخاب خوابگاه ‫1‬‫بدنسازی‬‫شاهد‬‫2‬‫شنا‬‫نرگس‬‫3‬‫فوتبال‬‫مریم‬‫4‬‫دو میدانی‬‫فرزانگان‬');
});
