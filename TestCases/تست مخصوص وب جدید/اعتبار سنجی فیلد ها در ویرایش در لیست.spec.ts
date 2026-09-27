import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page
    .getByRole("heading", { name: "اعتبارسنجی فیلد ها در ویرایش در لیست" })
    .click();
  await page.getByText("‫‪18‬").click();
  await page.keyboard.press("Control+A");
  await page.keyboard.press("Backspace");
  await page.getByRole("textbox").fill("15");
  await page.getByTitle('ویرایش در لیست').click();
  await page.getByTitle('ویرایش در لیست').click();
  await page.getByTitle('ویرایش در لیست').click();
  await expect(
    page.getByText(
      "اشکال در مقادیر فرم تعداد: مقدار ورودی `تعداد` نمی تواند کمتر از 18 باشد"
    )
  ).toBeVisible();
});
