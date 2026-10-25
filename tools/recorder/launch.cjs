const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { userProfiles, deviceProfiles } = require("./profiles.cjs");

const allowedUsers = new Set(userProfiles);
const allowedDevices = new Set(deviceProfiles);

function printUsage() {
  console.log(`Project recorder

Usage:
  npm run record
  npm run record:snapshot
  npm run record:mobile
  npm run record:mobile:snapshot
  npm run record:iphone
  npm run record:iphone:snapshot

Default user: rahbar. To use another profile, append -- --user=<profile>.
User profiles: rahbar, user1, user2, kartable

Options:
  --user=<profile>       User profile (default: rahbar)
  --device=<profile>     desktop, pixel-7, or iphone-15-pro-max
  --snapshot             Restore the snapshot before login (off by default)
  --check                Validate the recorder without launching a browser
  --help                 Show this help
`);
}

function parseArguments(arguments_) {
  const options = {
    device: "desktop",
    user: "rahbar",
    snapshot: false,
    check: false,
    help: false,
  };

  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];

    if (argument === "--help" || argument === "-h") {
      options.help = true;
      continue;
    }

    if (argument === "--check") {
      options.check = true;
      continue;
    }

    if (argument === "--snapshot") {
      options.snapshot = true;
      continue;
    }

    if (argument === "--user" || argument === "--device") {
      const value = arguments_[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${argument} requires a value.`);
      }

      options[argument.slice(2)] = value;
      index += 1;
      continue;
    }

    if (argument.startsWith("--user=")) {
      options.user = argument.slice("--user=".length);
      continue;
    }

    if (argument.startsWith("--device=")) {
      options.device = argument.slice("--device=".length);
      continue;
    }

    throw new Error(`Unknown option: ${argument}`);
  }

  return options;
}

let options;

try {
  options = parseArguments(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  printUsage();
  process.exit(1);
}

if (options.help) {
  printUsage();
  process.exit(0);
}

if (!allowedUsers.has(options.user)) {
  console.error(
    `--user must be one of: ${Array.from(allowedUsers).join(", ")}.`,
  );
  printUsage();
  process.exit(1);
}

if (!allowedDevices.has(options.device)) {
  console.error(
    `--device must be one of: ${Array.from(allowedDevices).join(", ")}.`,
  );
  printUsage();
  process.exit(1);
}

const projectRoot = path.resolve(__dirname, "..", "..");
const recorderConfig = path.join(__dirname, "playwright.config.ts");
const playwrightCli = require.resolve("@playwright/test/cli");
const playwrightArguments = ["test", "--config", recorderConfig];

if (options.check) {
  playwrightArguments.push("--list");
}

console.log(
  `${options.check ? "Checking" : "Starting"} recorder: ` +
    `user=${options.user}, device=${options.device}, ` +
    `snapshot=${options.snapshot ? "on" : "off"}`,
);

if (options.snapshot && !options.check) {
  console.warn(
    "WARNING: RestoreSnapshot will change the test environment before login.",
  );
}

const result = spawnSync(process.execPath, [playwrightCli, ...playwrightArguments], {
  cwd: projectRoot,
  env: {
    ...process.env,
    RECORDER_DEVICE: options.device,
    RECORDER_SNAPSHOT: options.snapshot ? "1" : "0",
    RECORDER_USER: options.user,
  },
  stdio: "inherit",
});

if (result.error) {
  console.error(`Unable to start Playwright: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
