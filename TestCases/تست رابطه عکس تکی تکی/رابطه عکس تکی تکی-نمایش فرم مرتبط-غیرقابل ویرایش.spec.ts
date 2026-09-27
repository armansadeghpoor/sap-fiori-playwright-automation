import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه عکس تکی تکی").click();
  await page
    .getByText(
      "رابطه عکس تکی(تکی)-خوابگاه-نمایش لیست ساده-فرم مرتبط غیرقابل ویرایش-نمایش آیکون "
    )
    .click();
  await page
    .getByRole("row", { name: "‫شاهد‬ ‫نیمه خصوصی‬ ‫1‬ " })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("fd-dynamic-page-content")).toContainText("نام:1");
  await page.getByTitle('Close').click();
});
