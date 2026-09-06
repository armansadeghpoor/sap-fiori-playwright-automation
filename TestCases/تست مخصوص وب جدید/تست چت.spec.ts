import { test, expect } from "@playwright/test";
test.setTimeout(200000);
test("test", async ({ browser, page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot"
  );
  await page.waitForTimeout(2000);
  await page.reload();
  //ایجاد راهبر
  const contextRahbar = await browser.newContext();
  const pageRahbar = await contextRahbar.newPage();
  //ایجاد کاربر1
  const contextKarbar1 = await browser.newContext();
  const pageKarbar1 = await contextKarbar1.newPage();
  //لاگین کردن راهبر
  await pageRahbar.goto("http://localhost:8000/#/login");
  await pageRahbar
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .click();
  await pageRahbar
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .fill("راهبر");
  await pageRahbar
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .press("Tab");
  await pageRahbar.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await pageRahbar.getByRole("textbox", { name: "xxxxxxx" }).press("Enter");
  await pageRahbar.goto("http://localhost:8000/#/home");
  await pageRahbar.locator('.fd-avatar__icon').click();
  await pageRahbar.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.waitForTimeout(500);
  await pageRahbar.locator('button.fd-shellbar__button--menu').click();
  await pageRahbar.locator('a').filter({ hasText: 'گفتگو' }).click();

  await pageRahbar.getByText("کاربر1", { exact: true }).click();
  await pageRahbar.locator('textarea').click();
  await pageRahbar.locator('textarea').fill("سلام این پیام راهبر است 1");
  await pageRahbar.getByRole('button', { name: 'ارسال' }).click();

  //لاگین کاربر1

  await pageKarbar1.goto("http://localhost:8000/#/login");
  await pageKarbar1
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .click();
  await pageKarbar1
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .fill("کاربر1");
  await pageKarbar1
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .press("Tab");
  await pageKarbar1.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await pageKarbar1.getByRole("textbox", { name: "xxxxxxx" }).press("Enter");
  await pageKarbar1.goto("http://localhost:8000/#/home");
  await pageKarbar1.locator('.fd-avatar__icon').click();
  await pageKarbar1.getByRole("menuitem", { name: "نویگیتور" }).click();
  await pageKarbar1.getByRole("button", { name: "Navigation" }).click();
  await pageKarbar1.waitForTimeout(500);
  await pageKarbar1.locator('button.fd-shellbar__button--menu').click();
  await pageKarbar1.locator('a').filter({ hasText: 'گفتگو' }).click();
  await expect(
    pageKarbar1.getByText("راهبر سیستم سلام این پیام راهبر است 1 1")
  ).toBeVisible();
  await pageKarbar1.getByText("راهبر سیستم").click();
  await pageKarbar1.locator('textarea').click();
  await pageKarbar1.locator('textarea').fill("این پیام از کاربر1 است1");
  await pageKarbar1.getByRole("button", { name: "ارسال" }).click();

  //چک کردن پیام کاربر 1 توسط راهبر
  await pageRahbar.waitForTimeout(2000);
  await pageRahbar.getByText("کاربر1", { exact: true }).nth(1).click();
});
