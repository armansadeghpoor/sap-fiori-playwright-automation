import type { TestUser } from "./types";

interface UserRegistry {
  readonly rahbar: TestUser;
  readonly user1: TestUser;
  readonly user2: TestUser;
}

export const users: UserRegistry = Object.freeze({
  rahbar: Object.freeze({
    username: process.env.RAHBAR_USERNAME ?? "راهبر",
    password: process.env.RAHBAR_PASSWORD ?? "123",
  }),
  user1: Object.freeze({
    username: process.env.USER1_USERNAME ?? "کاربر1",
    password: process.env.USER1_PASSWORD ?? "123",
  }),
  user2: Object.freeze({
    username: process.env.USER2_USERNAME ?? "کاربر2",
    password: process.env.USER2_PASSWORD ?? "123",
  }),
});
