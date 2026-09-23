import type { APIRequestContext } from "@playwright/test";

import { environment } from "../config/environment";

export async function restoreSnapshot(
  request: APIRequestContext,
): Promise<void> {
  const endpoint = `${environment.testApiBaseUrl}/api2/ModernWebTest/0.1/RestoreSnapshot`;
  const response = await request.get(endpoint);

  if (!response.ok()) {
    throw new Error(
      `RestoreSnapshot failed with HTTP ${response.status()} at ${endpoint}`,
    );
  }
}
