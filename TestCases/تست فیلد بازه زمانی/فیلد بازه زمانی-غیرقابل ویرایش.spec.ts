import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);

  await page.getByRole("button", { name: "Navigation" }).click();

  await page.locator("bsu-barsa-tree-item li").getByText("تست فیلد").click();
  await page
    .locator("bsu-barsa-tree-item li")
    .getByText("فیلد های نوع پیشرفته")
    .click();
  await page
    .locator("bsu-barsa-tree-item li")
    .getByText("فیلد بازه زمانی")
    .click();

  await page
    .getByText(
      "فیلد بازه زمانی-نمایش زمان-تکراری نباشد-غیرقابل ویرایش-مقدار پیش فرض"
    )
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.locator("bsu-ly-vertical-layout")).toMatchAriaSnapshot(`
    - text: "غیر قابل ویرایش:"
    - paragraph
    `);
});
