
import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";
import { recordingDevices } from "../../../framework/config/recording-devices";
import { restoreSnapshot } from "../../../framework/api/environment.api";

test.use({
  ...recordingDevices["desktop"],
  browserName: "chromium",
  channel: "chrome",
  storageState: { cookies: [], origins: [] },
});

test("4267", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);

  await page.locator(".fd-avatar__icon").click();

  await page.getByRole("menuitem", {
    name: "نویگیتور",
  }).click();

  await page.locator(
    'span.fd-shellbar__button[glyph="search"]'
  ).click();

  const searchDialog = page.locator(
    '[role="dialog"].search-navigator-modal'
  );

  await expect(searchDialog).toBeVisible();

  const searchInput = searchDialog.locator(
    'input[fd-input-group-input][type="text"]'
  );
  await page.waitForTimeout(6000);
  await searchInput.fill("");

  await searchInput.pressSequentially("favorite", {
    delay: 100,
  });

  const favoriteRow = searchDialog
    .locator("li.fd-list__item")
    .filter({ hasText: /favorite/i })
    .first();

  const favoriteButton = favoriteRow.locator(
    "button.fd-list__button"
  );

  await expect(favoriteButton).toBeVisible();

  await expect(favoriteButton).toHaveAttribute(
    "aria-label",
    "افزودن به علاقه‌مندی‌ها"
  );

  await favoriteButton.click();

  await expect(
    favoriteButton.locator("fd-icon")
  ).toHaveClass(/(?:^|\s)sap-icon--favorite(?:\s|$)/);

  await favoriteButton.hover();

  await expect(favoriteButton).not.toHaveAttribute(
    "title",
    /^Add To Favorite$/i
  );

  await expect(favoriteButton).not.toHaveAttribute(
    "aria-label",
    "افزودن به علاقه‌مندی‌ها"
  );

  await page.getByRole("button", {
    name: "close",
    exact: true,
  }).click();

  await expect(searchDialog).not.toBeVisible();

  await page.getByRole("tab", {
    name: "مورد علاقه default",
  }).click();

  await expect(
    page.getByRole("heading", {
      name: "favorite",
    })
  ).toBeVisible();

  await page.locator(
    'span.fd-shellbar__button[glyph="search"]'
  ).click();

  await expect(searchDialog).toBeVisible();

  await searchInput.fill("");

  await searchInput.pressSequentially("favorite", {
    delay: 100,
  });

  await expect(favoriteButton).toBeVisible();

  await expect(
    favoriteButton.locator("fd-icon")
  ).toHaveClass(/(?:^|\s)sap-icon--favorite(?:\s|$)/);

  await expect(favoriteButton).not.toHaveAttribute(
    "aria-label",
    "افزودن به علاقه‌مندی‌ها"
  );
});
