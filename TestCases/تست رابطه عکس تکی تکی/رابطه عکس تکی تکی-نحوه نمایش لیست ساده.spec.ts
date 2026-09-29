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
  await page.locator("#fd-input-group-button-id-0").click();
  await page.getByText("دو میدانی").click();
  await page.locator("#fd-input-group-button-id-1").click();
  await page.getByText("فرزانگان").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page
      .getByRole("row", { name: "‫4‬ ‫دو میدانی‬ ‫فرزانگان‬ " })
      .getByRole("cell")
      .first()
  ).toBeVisible();
});
