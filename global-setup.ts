// File: global-setup.ts
import { FullConfig } from '@playwright/test';
import path from 'path';

async function globalSetup(config: FullConfig) {
  const workerCount = config.workers;
  let reportPath: string;

  if (workerCount > 1) {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    reportPath = path.resolve(`./playwright-reports/report-${year}-${month}-${day}-${hours}-${minutes}`);
  } else {
    reportPath = path.resolve('./playwright-report');
  }
  
  process.env.PLAYWRIGHT_HTML_REPORT_PATH = reportPath;
}

export default globalSetup;