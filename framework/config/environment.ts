interface TestEnvironment {
  readonly baseUrl: string;
  readonly testApiBaseUrl: string;
  readonly username: string;
  readonly password: string;
}

const removeTrailingSlashes = (value: string): string => value.replace(/\/+$/, "");

export const environment: TestEnvironment = Object.freeze({
  baseUrl: removeTrailingSlashes(
    process.env.BASE_URL ?? "http://localhost:8000",
  ),
  testApiBaseUrl: removeTrailingSlashes(
    process.env.TEST_API_BASE_URL ?? "http://localhost:5126",
  ),
  username: process.env.TEST_USERNAME ?? "راهبر",
  password: process.env.TEST_PASSWORD ?? "123",
});
