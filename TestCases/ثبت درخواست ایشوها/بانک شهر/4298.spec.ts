
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

test("4298", async ({ page }) => {
  await loginAs(page, users.rahbar);

  await page.locator(".fd-avatar__icon").click();

  await page.getByRole("menuitem", {
    name: "نویگیتور",
  }).click();

  await page.getByRole("button", {
    name: "App Launcher",
  }).click();

  await page.getByText("میزکار الکترونیک", {
    exact: true,
  }).click();

  await page.getByRole("link", {
    name: "کارتابل وارده تفکیکی",
  }).click();

  const targetLink = page.getByRole("link", {
    name: "تمامی سمتهای من",
    exact: true,
  });

  await expect(targetLink).toHaveCount(1);
  await expect(targetLink).toBeVisible();

  const tagName = await targetLink.evaluate(
    (element) => element.tagName.toLowerCase()
  );

  expect(tagName).toBe("a");

  const href = await targetLink.getAttribute("href");

  expect(href).toBeTruthy();
  expect(href!.trim()).not.toBe("#");
  expect(href!.trim()).not.toMatch(/^javascript:/i);

  const expectedUrl = new URL(href!, page.url()).href;

  await targetLink.click({
    button: "right",
  });

  await page.keyboard.press("Escape");

  const newTab = await page.context().newPage();

  await newTab.goto(expectedUrl, {
    waitUntil: "domcontentloaded",
  });

  await expect(newTab).toHaveURL(expectedUrl);

  await expect(newTab).not.toHaveURL("about:blank");

  expect(page.isClosed()).toBe(false);

  await newTab.close();
});
