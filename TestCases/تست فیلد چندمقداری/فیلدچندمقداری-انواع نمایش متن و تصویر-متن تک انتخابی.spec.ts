import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد چندمقداری").click();
  await page.getByText("فیلد چندمقداری-انواع نمایش متن و تصویر").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("#fd-input-group-button-id-0").click();
  await expect(page.locator("fd-popover-body")).toMatchAriaSnapshot(`
    - dialog:
      - listbox:
        - listitem: انتخاب کنید
        - listitem: زرد
        - listitem: سبز
        - listitem: قرمز
        - listitem: صورتی
    `);
  await page.locator("ul li span").getByText("زرد").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.getByText(
      "جدید نمایش متن-تک انتخابی نمایش تصویر-تک انتخابی نمایش تصویر و متن-تک انتخابی ‫ز"
    )
  ).toBeVisible();
});
