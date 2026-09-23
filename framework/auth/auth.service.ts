import type { Page } from "@playwright/test";

import type { TestUser } from "./types";

export async function loginAs(page: Page, user: TestUser): Promise<void> {
  await page.goto("/#/login");

  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .fill(user.username);
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill(user.password);
  await page.getByRole("button", { name: "ورود" }).click();

  await page.getByRole("button", { name: "Navigation" }).waitFor();
}
