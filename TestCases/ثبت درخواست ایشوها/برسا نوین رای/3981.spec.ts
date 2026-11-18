
import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
  viewport: {
    height: 1080,
    width: 1920,
  },
});

test("test", async ({ page, context }) => {
  test.setTimeout(60000);

  await loginAs(page, users.rahbar);

  await page.locator("button.fd-shellbar__button--menu").click();

  await page.locator("a").filter({
    hasText: "نویگیتور",
  }).click();

  await page.getByRole("link", {
    name: "کارتابل وارده تفکیکی",
  }).click();

  await page.getByText("تمامی سمتهای من").click();
  // await page.getByText("تمامی سمتهای من").click();

  const target = page.locator("div.tw-flex.tw-gap-1").first();

  await expect(target).toBeVisible();

  const href = await target.evaluate((element) => {
    const link =
      element.closest("a[href]") ??
      element.querySelector("a[href]");

    return link?.getAttribute("href") ?? null;
  });

  const hasDirectLink =
    href !== null &&
    href.trim() !== "" &&
    href.trim() !== "#" &&
    !/^javascript:/i.test(href.trim());

  const targetUrl = hasDirectLink
    ? new URL(href!, page.url()).href
    : page.url();

  const newTab = await context.newPage();

  await newTab.goto(targetUrl, {
    waitUntil: "domcontentloaded",
  });

  await newTab.bringToFront();

  if (!hasDirectLink) {
    const newTabTarget = newTab
      .locator("div.tw-flex.tw-gap-1")
      .first();

    await expect(newTabTarget).toBeVisible({
      timeout: 15000,
    });

    await newTabTarget.click();
  }

  await expect(
    newTab.getByRole("heading", {
      name: "محتوای پیام",
    })
  ).toBeVisible({
    timeout: 15000,
  });

  await newTab.bringToFront();

  expect(newTab.isClosed()).toBe(false);
  expect(page.isClosed()).toBe(false);
});
