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
      "رابطه عکس تکی(تکی)-رشته ورزشی-نمایش دکمه جدید-لیست popup- نمایش زیرفرم",
    )
    .click();
  await page.getByText("‫دو میدانی‬").dblclick();
  await page
    .getByRole("tab", {
      name: "دانشجوی این رشته-نمایش دکمه جدید-لیست popup- نمایش زیرفرم default",
    })
    .click();
});
