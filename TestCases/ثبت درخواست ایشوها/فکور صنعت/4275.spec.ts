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

test("4275", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole('heading', { name: 'پریدن صفحه بندی بعد از رفرش' }).click();
  await expect(page).toHaveTitle(
    'پریدن صفحه بندی بعد از رفرش – برسانوین رای'
  );
});
