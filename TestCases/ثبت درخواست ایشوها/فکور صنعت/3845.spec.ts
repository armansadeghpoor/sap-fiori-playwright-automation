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
  await page.getByRole("link", { name: "3845" }).last().click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.getByRole("tablist")).toContainText(
    "نام و نام خانوادگی default شماره پرونده default کاربر ثبت شده default تاریخ ثبت نام default توضیحات کارشناس default سابقه شغلی default سن ثبت شده default مبلغ حقوق در بیمه default",
  );
  await page.waitForTimeout(1000);
  await page.locator(".fd-dialog__resize-handle").click();
  ////////////////////////
  const resizeHandle = page.locator(".fd-dialog__resize-handle");

  // گرفتن موقعیت دکمه resize
  const box = await resizeHandle.boundingBox();
  if (!box) throw new Error("Resize handle not found");

  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  // فرض کنید می‌خواهیم اندازه فرم را به اندازه 200px بزرگتر کنیم
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 500, startY + 200, { steps: 15 }); // حرکت دادن به اندازه دلخواه
  await page.mouse.up();
  await expect(page.getByRole("button", { name: "بیشتر" })).toBeVisible();
});
