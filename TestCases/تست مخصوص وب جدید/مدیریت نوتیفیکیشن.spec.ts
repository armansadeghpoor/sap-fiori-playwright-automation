import { test, expect } from "@playwright/test";
test.setTimeout(40000);
test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot",
  );
  await page.goto("http://localhost:8000/#/login");
  await page.waitForTimeout(2000);
  await page.reload();
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
  await page.waitForTimeout(1000);
  await page.getByRole("heading", { name: "مدیریت نوتیفیکیشن" }).dblclick();
  await page.getByRole("button", { name: "Notification Label" }).click();
  await page.getByRole("button", { name: "امروز", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: ": مدیریت نوتیفیکیشن" }),
  ).toBeVisible();
  await expect(page.getByText('حذف همه بجز این هفتهحذف همه بجز امروزحذف همه')).toBeVisible();;
  await page.getByRole("button", { name: "حذف همه", exact: true }).click();
  await page.getByRole("button", { name: "بله" }).click();
  await page
    .locator("button.fd-shellbar__button")
    .filter({ has: page.locator(".sap-icon--bell") })
    .click();
  await expect(page.getByText("(موردی یافت نشد)")).toBeVisible();
});
