import { defineConfig } from "@playwright/test";

import { environment } from "../../framework/config/environment";
import { recordingDevices } from "../../framework/config/recording-devices";

type RecorderDevice = keyof typeof recordingDevices;

const deviceName = (process.env.RECORDER_DEVICE ?? "desktop") as RecorderDevice;

if (!Object.prototype.hasOwnProperty.call(recordingDevices, deviceName)) {
  throw new Error(`Unsupported recorder device: ${deviceName}`);
}

export default defineConfig({
  testDir: ".",
  testMatch: "record.spec.ts",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  timeout: 120_000,
  reporter: "line",
  use: {
    baseURL: environment.baseUrl,
    browserName: "chromium",
    channel: "chrome",
    headless: false,
    screenshot: "off",
    trace: "off",
    video: "off",
    ...recordingDevices[deviceName],
  },
});
