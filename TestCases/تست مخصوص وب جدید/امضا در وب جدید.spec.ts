import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("امضا در وب جدید").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 791,
        y: 193,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 650,
        y: 180,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 430,
        y: 196,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 442,
        y: 292,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 540,
        y: 119,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 671,
        y: 310,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 874,
        y: 74,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 257,
        y: 145,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 188,
        y: 288,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 872,
        y: 310,
      },
    });
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole('link', { name: '‫تست‬' }).dblclick();
  await expect(page.locator('#fd-toolbar-12')).toMatchAriaSnapshot(`
    - toolbar:
      - button
      - button
      - button
    `);
  await page.locator("img").click();
});
