
import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";
import { recordingDevices } from "../../../framework/config/recording-devices";

test.use({
  ...recordingDevices["desktop"],
  browserName: "chromium",
  channel: "chrome",
  storageState: { cookies: [], origins: [] },
});

test("4281", async ({ page }) => {
  await loginAs(page, users.rahbar);

  await page.locator(".fd-avatar__icon").click();

  await page.getByRole("menuitem", {
    name: "نویگیتور",
  }).click();

  await page.getByRole("button", {
    name: "App Launcher",
  }).click();

  await page.getByRole("menuitem", {
    name: "ثبت درخواست ایشوها ایشوها ثبت شده در سامانه ثبت درخواست",
  }).getByText("ثبت درخواست ایشوها").click();

  const sectionTitle = page
    .locator("h3.bn-nav__section-title")
    .filter({ hasText: "برسا نوین رای" });

  const groupTitle = page
    .locator("button.bn-nav__group-btn")
    .filter({
      hasText: "بسته نشدن فرم با خروج از کارتابل در فرآیند",
    });

  const reportTitle = page
    .locator("a.bn-nav__report")
    .filter({
      hasText: "بسته نشدن فرم با خروج از کارتابل در فرآیند",
    });

  await expect(sectionTitle).toHaveCount(1);
  await expect(sectionTitle).toBeVisible();

  await expect(
    sectionTitle.locator('fd-icon[glyph="list"]')
  ).toBeVisible();

  await expect(groupTitle).toHaveCount(1);
  await expect(groupTitle).toBeVisible();

  if (await groupTitle.getAttribute("aria-expanded") !== "true") {
    await groupTitle.click();
  }

  await expect(groupTitle).toHaveAttribute(
    "aria-expanded",
    "true"
  );

  await expect(
    groupTitle.locator('fd-icon[glyph="slim-arrow-down"]')
  ).toBeVisible();

  await expect(reportTitle).toHaveCount(1);
  await expect(reportTitle).toBeVisible();

  await expect(reportTitle).toHaveAttribute(
    "href",
    /^#\/application\/report\//
  );

  await expect(sectionTitle).toHaveScreenshot(
    "4281-section.png",
    {
      animations: "disabled",
      caret: "hide",
    }
  );

  await expect(groupTitle).toHaveScreenshot(
    "4281-group.png",
    {
      animations: "disabled",
      caret: "hide",
    }
  );

  await expect(reportTitle).toHaveScreenshot(
    "4281-report.png",
    {
      animations: "disabled",
      caret: "hide",
    }
  );
});
