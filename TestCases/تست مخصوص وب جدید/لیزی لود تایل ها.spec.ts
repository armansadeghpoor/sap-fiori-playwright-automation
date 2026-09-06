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
  const card = page.locator(
    'fd-card:has(h2.fd-card__title:has-text("جابجا شدن فوتر با هدر فرم"))',
  );
  const img = card.locator('img[alt="جابجا شدن فوتر با هدر فرم"]');
  await page.waitForTimeout(4000);
  await expect(img).toBeVisible();
  await expect(img).toHaveAttribute("src", /.+/);

  const { complete, naturalWidth } = await img.evaluate(
    (el: HTMLImageElement) => ({
      complete: el.complete,
      naturalWidth: el.naturalWidth,
    }),
  );
  expect(complete).toBeTruthy();
  expect(naturalWidth).toBeGreaterThan(0);
});
