import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("ویرایش در لیست", { exact: true }).click();
  await page.getByText("انواع فیلد").click();
  await page.getByText("فیلدهای نوع ساده").click();
  await expect(page.getByTitle("ویرایش در لیست")).toBeVisible();
  await expect(page.getByTitle("ویرایش در لیست")).toHaveClass(
    /fd-button--emphasized/,
  );
  await expect(
    page.locator(
      "button.fd-button--transparent.is-compact:has(fd-icon.sap-icon--navigation-left-arrow)",
    ),
  ).toBeHidden();
  await page.getByTitle("ویرایش در لیست").click();
  await expect(page.getByTitle("ویرایش در لیست")).toHaveClass(
    /fd-button--transparent/,
  );
  await expect(
    page.locator(
      "button.fd-button--transparent.is-compact:has(fd-icon.sap-icon--navigation-left-arrow)",
    ),
  ).toBeVisible();
  await page.getByTitle("ویرایش در لیست").click();
  await expect(page.getByTitle("ویرایش در لیست")).toHaveClass(
    /fd-button--emphasized/,
  );
  await expect(
    page.locator(
      "button.fd-button--transparent.is-compact:has(fd-icon.sap-icon--navigation-left-arrow)",
    ),
  ).toBeHidden();
});
