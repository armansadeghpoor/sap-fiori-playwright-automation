import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";
test.setTimeout(40000);
test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.waitForTimeout(1000);
  await page.getByRole("heading", { name: "مدیریت نوتیفیکیشن" }).dblclick();
  await page.getByRole("button", { name: "Notification Label" }).click();
  await page.getByRole("button", { name: "امروز", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: ": مدیریت نوتیفیکیشن" }),
  ).toBeVisible();
  await expect(page.getByText('حذف همه بجز این هفتهحذف همه بجز امروزحذف همه')).toBeVisible();;
  await page.getByRole("button", { name: "حذف همه", exact: true }).click();
  await page.getByRole("button", { name: "بله" }).click();
  await page
    .locator("button.fd-shellbar__button")
    .filter({ has: page.locator(".sap-icon--bell") })
    .click();
  await expect(page.getByText("(موردی یافت نشد)")).toBeVisible();
});
