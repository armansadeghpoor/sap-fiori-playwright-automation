import { test, expect } from '@playwright/test';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test('بررسی لود شدن آخرین عکس با استفاده از اسنپ‌شات تصویری', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('ثبت درخواست ایشوها').last().click();
  await page.getByRole('link', { name: '3901' }).last().click();
  await page.getByRole('link', { name: '‫*حذف نشود*‬' }).dblclick();


  const lastImage = page.locator("fd-card-content img").last();

  await lastImage.scrollIntoViewIfNeeded();

  await expect(lastImage).toHaveAttribute(
    "src",
    /BarsaPicture\.Thumbnail/,
    { timeout: 15000 }
  );

  await expect.poll(async () => {
    return lastImage.evaluate((img: HTMLImageElement) =>
      img.complete &&
      img.naturalWidth > 0 &&
      img.naturalHeight > 0
    );
  }, { timeout: 15000 }).toBe(true);

  const imageBase64 = await lastImage.evaluate(
    (img: HTMLImageElement) => {
      const canvas = document.createElement("canvas");
      canvas.width = 65;
      canvas.height = 97;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas is not available");
      }

      ctx.drawImage(img, 0, 0, 65, 97);

      return canvas.toDataURL("image/png").split(",")[1];
    }
  );

  expect(
    Buffer.from(imageBase64, "base64")
  ).toMatchSnapshot("last-image-canvas.png", {
    maxDiffPixels: 200,
  });


});