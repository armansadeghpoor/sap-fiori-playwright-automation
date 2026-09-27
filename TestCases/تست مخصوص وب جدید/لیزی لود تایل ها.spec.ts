import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
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
