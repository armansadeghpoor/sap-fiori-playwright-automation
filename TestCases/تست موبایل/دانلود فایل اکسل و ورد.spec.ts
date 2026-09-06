import { test, expect, devices } from "@playwright/test";

test.use({
  ...devices["Pixel 7"],
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
  await page.getByRole("button", { name: "ورود" }).click();
  await page.getByRole("tab", { name: "تست موبایل-تایل default" }).click();
  await page.getByRole("heading", { name: "دانلود فایل در موبایل" }).click();
  await page.getByText("*حذف نشود*").dblclick();
  const downloadPromise = page.waitForEvent("download");
  await page
  .locator('button[fd-button][fd-toolbar-item]:has(fd-icon.sap-icon--download)')
  .first()
  .click();
  const download = await downloadPromise;
  await page.getByRole("tab", { name: "فایل اکسل default" }).click();
  await page.getByRole("button", { name: "دانلود " }).click();
  const page1Promise = page.waitForEvent("popup");
  const download1Promise = page.waitForEvent("download");
  await page.getByText("دانلودهمه").click();
  const page1 = await page1Promise;
  const download1 = await download1Promise;
  await page.getByRole("tab", { name: "لیست تصاویر default" }).click();
});
