import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("گزارش در فیلد عددی").click();
  await page.getByText("گزارش تجمیعی").click();
  await page
    .getByText("گزارش تجمیعی در قاعده کاری-وجود دارد-معرف مشتری=راهبر")
    .click();
  await page
    .getByRole("row", { name: "‫شهاب‬ ‫‪727‬ ‫shahab@yahoo." })
    .getByRole("button")
    .click();
  await expect(
    page.getByText("تست گزارش تجمیعی در حالت وجود دارد")
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await expect(page.getByRole("combobox", { name: "انتخاب کنید" })).toHaveValue(
    "راهبر سیستم"
  );
  await page.getByTitle('Close').click();
});
