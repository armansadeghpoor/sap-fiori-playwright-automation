import { devices } from "@playwright/test";

// Both the Recorder and generated tests use Chrome with these same emulation options.
const { defaultBrowserType: _pixelBrowser, ...pixel7 } = devices["Pixel 7"];
const { defaultBrowserType: _iphoneBrowser, ...iphone15ProMax } =
  devices["iPhone 15 Pro Max"];

export const recordingDevices = {
  desktop: { viewport: { width: 1920, height: 950 } },
  "pixel-7": pixel7,
  "iphone-15-pro-max": iphone15ProMax,
} as const;
