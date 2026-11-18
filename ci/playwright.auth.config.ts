import { defineConfig } from '@playwright/test';
import { environment } from '../framework/config/environment';

export default defineConfig({
  testDir: '.',
  testMatch: '**/auth.setup.spec.ts',

  workers: 1,
  retries: 0,
  reporter: 'list',

  use: {
    baseURL: environment.baseUrl,
    browserName: 'chromium',
    channel: 'chrome',
    storageState: {
      cookies: [],
      origins: []
    }
  }
});