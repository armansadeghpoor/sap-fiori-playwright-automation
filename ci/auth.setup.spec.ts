import { test } from '@playwright/test';
import { loginAs } from '../framework/auth/auth.service';
import { users } from '../framework/auth/users';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

test('Generate CI authentication state', async ({ page }) => {
  if (!process.env.RAHBAR_USERNAME ||
      !process.env.RAHBAR_PASSWORD) {
    throw new Error('CI authentication credentials are missing');
  }

  await loginAs(page, users.rahbar);

  const authFile = path.resolve(
    'playwright/.auth/ci-state.json'
  );

  await mkdir(path.dirname(authFile), {
    recursive: true
  });

  await page.context().storageState({
    path: authFile
  });
});