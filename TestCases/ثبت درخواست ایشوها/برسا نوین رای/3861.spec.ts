import { test, expect } from "@playwright/test";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await page.goto("http://localhost:8000/#/login");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .fill("راهبر");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .press("Tab");
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("textbox", { name: "xxxxxxx" }).press("Enter");
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("ثبت درخواست ایشوها").last().click();
  await page.getByRole("link", { name: "3861" }).last().click();
  await page
    .locator("bsu-barsa-row-inline-actionlist")
    .getByRole("button")
    .first()
    .click();
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .click();
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .click();
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .click();
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .click();
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .press("ArrowDown");
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .press("ArrowDown");
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .press("ArrowDown");
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .press("ArrowDown");
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .press("ArrowDown");
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .press("ArrowDown");
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .press("ArrowDown");
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .press("ArrowDown");
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .press("ArrowDown");
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .press("ArrowDown");
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .press("ArrowDown");
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .press("ArrowDown");
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .press("ArrowDown");
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .press("ArrowDown");
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .press("ArrowDown");
  await page
    .getByRole("textbox", {
      name: "تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ",
    })
    .fill(
      "تست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\nتست\n",
    );
});
