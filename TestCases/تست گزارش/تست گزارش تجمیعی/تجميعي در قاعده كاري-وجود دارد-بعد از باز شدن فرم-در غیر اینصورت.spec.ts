import { test, expect } from "@playwright/test";

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
  await page.getByRole("button", { name: "ورود" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("گزارش در فیلد عددی").click();
  await page.getByText("گزارش تجمیعی").click();
  await page
    .getByText("گزارش تجمیعی در قاعده کاری-وجود دارد-معرف مشتری=راهبر")
    .click();
  await page
    .getByRole("row", { name: "‫noshin‬ ‫‪292‬ ‫noshin@gmail" })
    .getByRole("button")
    .click();
  await expect(
    page.getByText("در غیر اینصورت تست گزارش تجمیعی در حالت وجود دارد")
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByTitle('Close').click();
});
