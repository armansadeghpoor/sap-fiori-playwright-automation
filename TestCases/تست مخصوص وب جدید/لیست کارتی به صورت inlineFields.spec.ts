import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("heading", { name: "نمایش توضیحات در گرید" }).click();
  await expect(page.locator("bsu-card-view-content")).toContainText(
    "تست 2عنوان‫تست 2‬توضیحات‫تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36‬"
  );
});
