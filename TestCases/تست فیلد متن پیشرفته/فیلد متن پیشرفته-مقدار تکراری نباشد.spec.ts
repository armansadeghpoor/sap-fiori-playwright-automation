import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های نوع پیشرفته").click();
  await page.getByText("فیلد متن پیشرفته").click();
  await page.getByText("فیلد متن پیشرفته HTML").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator('iframe[title="Rich Text Area"]')
    .contentFrame()
    .getByLabel("Rich Text Area. Press ALT-0")
    .click();
  await page
    .locator('iframe[title="Rich Text Area"]')
    .contentFrame()
    .getByLabel("Rich Text Area. Press ALT-0")
    .fill("﻿تست\n");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page
    .locator('iframe[title="Rich Text Area"]')
    .contentFrame()
    .getByLabel("Rich Text Area. Press ALT-0")
    .click();
  await page.waitForTimeout(1000);
  await page
    .locator('iframe[title="Rich Text Area"]')
    .contentFrame()
    .getByLabel("Rich Text Area. Press ALT-0")
    .fill("﻿تست\n");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.getByText(
      "مقدار فیلد 'فیلد متن پیشرفته -مقدار تکراری نباشد.مقدار تکراری نباشد' تکراری است ",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
