import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator(".fd-avatar__icon").click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
 await page.getByText('تست مخصوص وب جدید', { exact: true }).click();
  await page.getByRole("link", { name: "نشانه گذاری متن پیشرفته" }).click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "Font B-Font" }).click();
  await page.getByLabel("B-Font", { exact: true }).getByText("B-Font").click();
  await page
    .locator('iframe[title="Rich Text Area"]')
    .contentFrame()
    .getByRole("paragraph")
    .click();
  await page
    .locator('iframe[title="Rich Text Area"]')
    .contentFrame()
    .getByLabel("Rich Text Area. Press ALT-0")
    .fill("﻿تست\n\n");

  await page.getByRole("button", { name: "Font B-Font" }).click();
  await page.waitForTimeout(5000);
  //   await page.getByText("Arial").click();
  await page.locator("body div").getByText("Arial").dblclick();

  await page
    .locator('iframe[title="Rich Text Area"]')
    .contentFrame()
    .getByLabel("Rich Text Area. Press ALT-0")
    .fill("﻿تست\n﻿تست\n\n");
  await page.getByRole("button", { name: "B-Font" }).click();
  await page.getByText("Courier New").click();
  await page
    .locator('iframe[title="Rich Text Area"]')
    .contentFrame()
    .getByLabel("Rich Text Area. Press ALT-0")
    .fill("﻿تست\n﻿تست\n﻿تست\n");
});
