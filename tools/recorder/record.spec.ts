import { test } from "@playwright/test";

import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

type UserProfile = keyof typeof users;

const userProfile = process.env.RECORDER_USER as UserProfile | undefined;
const restoreBeforeRecording = process.env.RECORDER_SNAPSHOT === "1";

if (!userProfile || !Object.prototype.hasOwnProperty.call(users, userProfile)) {
  throw new Error(
    "RECORDER_USER must select rahbar, user1, user2, or kartable. " +
      "Start this recorder through an npm record command.",
  );
}

test("record business flow", async ({ page, request }) => {
  if (restoreBeforeRecording) {
    await restoreSnapshot(request);
  }
  await loginAs(page, users[userProfile]);

  console.log(
    `Recorder ready for ${userProfile}. ` +
      "Record only the business flow, then copy it before resuming or closing the Inspector.",
  );

  test.setTimeout(0);
  await page.pause();
});
