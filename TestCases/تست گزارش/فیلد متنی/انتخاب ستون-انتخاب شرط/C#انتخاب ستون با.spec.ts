import { test, expect } from "@playwright/test";
import { loginAs } from "../../../../framework/auth/auth.service";
import { users } from "../../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText('گزارش در فیلد متنی').click();
  await page.getByText("انتخاب ستون و انتخاب شرط").click();
  await page.getByText("فیلد متنی-گزارش-انتخاب ستون با c#").click();
  await page.getByRole('row', { name: '‫رها‬ ‫اعتمادی‬ ' }).getByRole('button').click();
  await expect(page.locator("fd-layout-grid")).toMatchAriaSnapshot(`
    - text: "نام:"
    - textbox "رها"
    - text: "نام خانوادگی:"
    - textbox "اعتمادی"
    `);
});
