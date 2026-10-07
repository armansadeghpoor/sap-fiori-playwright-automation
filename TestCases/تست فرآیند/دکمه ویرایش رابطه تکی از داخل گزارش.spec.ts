import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  test.setTimeout(50000);
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "بازآوری ساختار" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند", { exact: true }).click();
  await page.getByText("محل باز شدن فرم").click();
  await page.getByText("دکمه ویرایش رابطه تکی").click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("combobox", { name: "انتخاب کنید" }).click();
  await page
    .getByRole("combobox", { name: "انتخاب کنید" })
    .fill("آدرس تست 5.1.1");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("bsu-column-renderer")).toContainText(
    "‫آدرس تست 5.1‬"
  );
});
