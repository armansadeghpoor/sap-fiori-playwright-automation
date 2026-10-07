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
  await page.getByText("فیلد چندمقداری-نمایش تک انتخابی-رادیویی").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.locator("fd-layout-grid")).toMatchAriaSnapshot(`
    - text: "نمایش تک انتخابی-رادیویی:"
    - radio "آبی"
    - text: آبی
    - radio "زرد"
    - text: زرد
    - radio "قرمز"
    - text: قرمز
    - radio "سبز"
    - text: سبز
    `);
  await page.locator("label").filter({ hasText: "زرد" }).click();
  await page.locator("label").filter({ hasText: "قرمز" }).click();
  await expect(page.locator("fd-layout-grid")).toMatchAriaSnapshot(`
    - text: "نمایش تک انتخابی-رادیویی:"
    - radio "آبی"
    - text: آبی
    - radio "زرد"
    - text: زرد
    - radio "قرمز" [checked]
    - text: قرمز
    - radio "سبز"
    - text: سبز
    `);
  await page.locator("label").filter({ hasText: "زرد" }).click();
  await expect(page.locator("fd-layout-grid")).toMatchAriaSnapshot(`
    - text: "نمایش تک انتخابی-رادیویی:"
    - radio "آبی"
    - text: آبی
    - radio "زرد" [checked]
    - text: زرد
    - radio "قرمز"
    - text: قرمز
    - radio "سبز"
    - text: سبز
    `);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
