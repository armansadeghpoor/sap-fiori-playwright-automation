# SAP Fiori & Angular E2E Automation Framework

A robust, production-ready End-to-End (E2E) testing framework built with **Playwright** and **TypeScript**. This project is specifically architected to handle the complex, highly dynamic, and heavily nested DOM structures typical of enterprise applications built on **SAP Fiori** and **Angular**.

## Engineering Challenges & Solutions

Automating enterprise UI frameworks like SAP Fiori introduces unique automation hurdles that go far beyond standard web testing. This framework addresses them directly:

* **Handling Dynamic Identifiers:** Overcame the challenge of auto-generated, unpredictable DOM IDs (e.g., `fd-button-54`) by engineering resilient locators using custom SAP UI5 attributes (e.g., `glyph="add"`), embedded UI icons (`.sap-icon--slim-arrow-down`), and accessibility roles combined with text filtering.
* **Complex DOM Trees & Strict Mode Avoidance:** Implemented smart, scoped locators (`locator.filter({ has: ... })`) to navigate from parent containers to children. This prevents Playwright's Strict Mode violations in highly nested grids, list views, and toolbars where multiple identical elements exist.
* **Resource Management & Stability:** Solved `ECONNREFUSED` and local server crash issues by optimizing Playwright's execution constraints. Tuned the worker thread count (`workers: 2`) to stabilize CPU/RAM usage and eliminated hardcoded timeouts in favor of dynamic DOM state assertions (`toHaveCount()`).
* **Session Authentication Bypassing:** Utilized Playwright's `storageState` feature to cache authentication cookies and tokens (`localstorage.json`), entirely bypassing repetitive login sequences and drastically reducing overall test suite execution time.

##  Tech Stack & Tooling
* **Core Framework:** [Playwright](https://playwright.dev/)
* **Language:** TypeScript
* **Target Environment:** SAP Fiori Components (`fd-button`, `fd-list-item`, `sap-icon`) and Custom Angular Tags (`bsu-ui-list-view`).
* **Assertion Strategy:** Smart, auto-retrying web-first assertions.

##  Configuration Highlights
The `playwright.config.ts` is fine-tuned for enterprise reliability:

```typescript
{
  fullyParallel: false, // Prevents session collisions in local Dev environments
  workers: 2,           // Optimized for stable memory consumption without crashing
  retries: 0,
  use: {
    storageState: "localstorage.json", // Uses cached login session
    trace: "on-first-retry",
    video: "retain-on-failure",        // Disk-space saving strategy for CI/CD
    screenshot: "only-on-failure",
  }
}
```

## How to Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the tests (Headless mode for maximum speed):**
   ```bash
   npx playwright test
   ```
3. **Run the tests in UI Mode (for debugging):**
   ```bash
   npx playwright test --ui
   ```
4. **View the detailed HTML Report:**
   ```bash
   npx playwright show-report
   ```

---
*Developed as a technical showcase of advanced test automation engineering, focusing on stability, system performance, and resilient locator strategies in modern enterprise architectures.*+
