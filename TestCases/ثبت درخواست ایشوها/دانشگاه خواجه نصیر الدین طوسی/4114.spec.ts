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

test("4114", async ({ page }) => {
  await loginAs(page, users.rahbar);

  await page.locator(".fd-avatar__icon").click();

  await page.getByRole("menuitem", { name: "نویگیتور" }).click();

  await page.getByRole("button", { name: "App Launcher" }).click();

  await page.getByRole("menuitem", {
    name: "ثبت درخواست ایشوها ایشوها ثبت شده در سامانه ثبت درخواست",
  }).click();

  await page.getByRole("searchbox", {
    name: "جستجو در گزارش‌ها",
  }).fill("4114");

  await page.getByRole("link", { name: "4114" }).click();

  const firstLink = page.getByRole("link", {
    name: /اولی/,
  }).first();

  await expect(firstLink).toBeVisible();

  const scrollContainer = await firstLink.evaluateHandle((element) => {
    let parent = element.parentElement;

    while (parent) {
      const style = window.getComputedStyle(parent);

      if (
        (style.overflowY === "auto" ||
          style.overflowY === "scroll") &&
        parent.scrollHeight > parent.clientHeight
      ) {
        return parent;
      }

      parent = parent.parentElement;
    }

    return document.scrollingElement ?? document.documentElement;
  });

  const lastLink = page.getByRole("link", {
    name: /آخری/,
  }).last();

  for (let i = 0; i < 50; i++) {
    const isAtBottom = await scrollContainer.evaluate((element) => {
      const container = element as HTMLElement;

      container.scrollTop += Math.max(
        container.clientHeight * 0.8,
        400
      );

      return (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 2
      );
    });

    await page.waitForTimeout(200);

    if (isAtBottom && await lastLink.count() > 0) {
      break;
    }
  }

  await expect(lastLink).toBeVisible();

  await lastLink.dblclick();

  await page.getByRole("button", { name: "Close" }).click();

  await expect(firstLink).not.toBeInViewport();
});