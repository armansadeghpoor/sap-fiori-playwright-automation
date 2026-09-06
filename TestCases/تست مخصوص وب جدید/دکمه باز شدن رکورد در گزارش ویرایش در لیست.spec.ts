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
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("ویرایش در لیست", { exact: true }).click();
  await page.getByText("انواع فیلد").click();
  await page.getByText("فیلدهای نوع ساده").click();
  await expect(page.getByTitle("ویرایش در لیست")).toBeVisible();
  await expect(page.getByTitle("ویرایش در لیست")).toHaveClass(
    /fd-button--emphasized/,
  );
  await expect(
    page.locator(
      "button.fd-button--transparent.is-compact:has(fd-icon.sap-icon--navigation-left-arrow)",
    ),
  ).toBeHidden();
  await page.getByTitle("ویرایش در لیست").click();
  await expect(page.getByTitle("ویرایش در لیست")).toHaveClass(
    /fd-button--transparent/,
  );
  await expect(
    page.locator(
      "button.fd-button--transparent.is-compact:has(fd-icon.sap-icon--navigation-left-arrow)",
    ),
  ).toBeVisible();
  await page.getByTitle("ویرایش در لیست").click();
  await expect(page.getByTitle("ویرایش در لیست")).toHaveClass(
    /fd-button--emphasized/,
  );
  await expect(
    page.locator(
      "button.fd-button--transparent.is-compact:has(fd-icon.sap-icon--navigation-left-arrow)",
    ),
  ).toBeHidden();
});
