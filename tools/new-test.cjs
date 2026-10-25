const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { userProfiles, deviceProfiles } = require("./recorder/profiles.cjs");

const projectRoot = path.resolve(__dirname, "..");
const testRoot = path.join(projectRoot, "TestCases");
const reservedNames = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i;

function usage() {
  console.log(
    "Usage: npm run new:test -- --name <test title> --path <folder or .spec.ts path> " +
      "[--user rahbar|user1|user2|kartable] " +
      "[--device desktop|pixel-7|iphone-15-pro-max] " +
      "[--snapshot enabled|disabled] [--no-record] [--preview] [--json]\n" +
      "--preview returns the validated output path without creating or recording.\n" +
      "--json --no-record creates a spec and returns its path as JSON. --describe lists profiles.\n" +
      "The path is relative to TestCases; a leading TestCases/ is also accepted.\n" +
      "By default, the new spec is created and the Recorder starts.",
  );
}

function parseArguments(arguments_) {
  const options = {
    user: "rahbar",
    device: "desktop",
    snapshot: "disabled",
    record: true,
  };
  const valuedOptions = new Set(["name", "path", "user", "device", "snapshot"]);

  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];
    if (argument === "--help" || argument === "-h") {
      options.help = true;
      continue;
    }
    if (argument === "--no-record") {
      options.record = false;
      continue;
    }
    if (argument === "--preview" || argument === "--json" || argument === "--describe") {
      options[argument.slice(2)] = true;
      continue;
    }

    const equalsIndex = argument.indexOf("=");
    const key = argument.startsWith("--")
      ? argument.slice(2, equalsIndex === -1 ? undefined : equalsIndex)
      : "";
    if (!valuedOptions.has(key)) {
      throw new Error("Unknown option: " + argument);
    }

    const value =
      equalsIndex === -1 ? arguments_[++index] : argument.slice(equalsIndex + 1);
    if (!value || value.startsWith("--")) {
      throw new Error("--" + key + " requires a value.");
    }
    options[key] = value;
  }

  return options;
}

function isWithin(root, candidate) {
  const relative = path.relative(root, candidate);
  return (
    relative === "" ||
    (relative !== ".." &&
      !relative.startsWith(".." + path.sep) &&
      !path.isAbsolute(relative))
  );
}

function nearestExisting(absolutePath) {
  let current = absolutePath;
  while (!fs.existsSync(current)) {
    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error("No existing ancestor for: " + absolutePath);
    }
    current = parent;
  }
  return current;
}

function validateSegment(segment) {
  if (
    segment === ".." ||
    /[\x00-\x1f<>:"|?*]/u.test(segment) ||
    /[. ]$/u.test(segment) ||
    reservedNames.test(segment)
  ) {
    throw new Error("Invalid path segment: " + segment);
  }
}

function fileNameFromTitle(title) {
  const stem = title
    .replace(/[\x00-\x1f<>:"/\\|?*]/gu, "-")
    .replace(/^[. ]+|[. ]+$/gu, "");
  if (!stem || reservedNames.test(stem) || stem.length > 180) {
    throw new Error("The test name cannot form a safe filename.");
  }
  return stem + ".spec.ts";
}

function resolveSpecPath(rawPath, title) {
  if (
    path.isAbsolute(rawPath) ||
    path.win32.isAbsolute(rawPath) ||
    /^[a-zA-Z]:/u.test(rawPath)
  ) {
    throw new Error("Use a path relative to TestCases.");
  }

  const segments = rawPath.replace(/\\/gu, "/").split("/");
  if (segments[0]?.toLowerCase() === "testcases") {
    segments.shift();
  }
  const parts = segments.filter((segment) => segment && segment !== ".");
  parts.forEach(validateSegment);

  const finalPart = parts.at(-1);
  if (finalPart && /\.ts$/iu.test(finalPart) && !finalPart.endsWith(".spec.ts")) {
    throw new Error("An explicit test filename must end in .spec.ts.");
  }
  if (!finalPart || !finalPart.endsWith(".spec.ts")) {
    parts.push(fileNameFromTitle(title));
  }

  const specPath = path.resolve(testRoot, ...parts);
  if (!isWithin(testRoot, specPath) || specPath === testRoot) {
    throw new Error("The generated spec must stay inside TestCases.");
  }

  const realRoot = fs.realpathSync(testRoot);
  const parentPath = path.dirname(specPath);
  const realAncestor = fs.realpathSync(nearestExisting(parentPath));
  if (!isWithin(realRoot, realAncestor)) {
    throw new Error("The selected path resolves outside TestCases.");
  }
  return { specPath, realRoot };
}

function importPath(specDirectory, modulePath) {
  const relative = path.relative(specDirectory, path.join(projectRoot, modulePath));
  const slashPath = relative.split(path.sep).join("/");
  return slashPath.startsWith(".") ? slashPath : "./" + slashPath;
}

function makeSpec(title, options, specPath) {
  const directory = path.dirname(specPath);
  const authService = importPath(directory, "framework/auth/auth.service");
  const users = importPath(directory, "framework/auth/users");
  const deviceProfilesModule = importPath(
    directory,
    "framework/config/recording-devices",
  );
  const snapshotImport = importPath(directory, "framework/api/environment.api");
  const withSnapshot = options.snapshot === "enabled";

  const lines = [
    'import { test, expect } from "@playwright/test";',
    'import { loginAs } from ' + JSON.stringify(authService) + ";",
    'import { users } from ' + JSON.stringify(users) + ";",
    'import { recordingDevices } from ' +
      JSON.stringify(deviceProfilesModule) + ";",
  ];
  if (withSnapshot) {
    lines.push(
      'import { restoreSnapshot } from ' + JSON.stringify(snapshotImport) + ";",
    );
  }
  lines.push(
    "",
    "test.use({",
    "  ...recordingDevices[" + JSON.stringify(options.device) + "],",
    '  browserName: "chromium",',
    '  channel: "chrome",',
    "  storageState: { cookies: [], origins: [] },",
    "});",
    "",
    "test(" +
      JSON.stringify(title) +
      ", async ({ " +
      (withSnapshot ? "page, request" : "page") +
      " }) => {",
  );
  if (withSnapshot) {
    lines.push("  await restoreSnapshot(request);");
  }
  lines.push(
    "  await loginAs(page, users." + options.user + ");",
    "",
    "  // Paste the recorded business actions and assertions here.",
    "});",
    "",
  );
  return lines.join("\n");
}

function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    usage();
    return;
  }
  if (options.describe) {
    console.log(JSON.stringify({ protocolVersion: 1, userProfiles, deviceProfiles }));
    return;
  }
  const title = options.name?.trim();
  const targetPath = options.path?.trim();
  if (!title || !targetPath) {
    throw new Error("--name and --path are required. Use --help for examples.");
  }
  if (/[\x00-\x1f]/u.test(title)) {
    throw new Error("The test name cannot contain control characters.");
  }
  if (!userProfiles.includes(options.user)) {
    throw new Error("Unknown user profile: " + options.user);
  }
  if (!deviceProfiles.includes(options.device)) {
    throw new Error("Unknown device: " + options.device);
  }
  if (!["enabled", "disabled"].includes(options.snapshot)) {
    throw new Error("--snapshot must be enabled or disabled.");
  }

  const { specPath, realRoot } = resolveSpecPath(targetPath, title);
  const directory = path.dirname(specPath);
  if (fs.existsSync(specPath)) {
    throw new Error("Spec already exists; nothing was overwritten: " + specPath);
  }
  if (options.preview) {
    console.log(JSON.stringify({ specPath, user: options.user, device: options.device, snapshot: options.snapshot }));
    return;
  }
  if (options.json && options.record) {
    throw new Error("--json requires --no-record or --preview.");
  }
  fs.mkdirSync(directory, { recursive: true });
  if (!isWithin(realRoot, fs.realpathSync(directory))) {
    throw new Error("The selected path resolves outside TestCases.");
  }
  fs.writeFileSync(specPath, makeSpec(title, options, specPath), {
    encoding: "utf8",
    flag: "wx",
  });
  if (options.json) {
    console.log(JSON.stringify({ specPath }));
    return;
  }

  const relativeSpec = path.relative(projectRoot, specPath);
  console.log("Created " + relativeSpec);
  console.log(
    "Setup: user=" +
      options.user +
      ", device=" +
      options.device +
      ", snapshot=" +
      options.snapshot,
  );

  const recorderArguments = [
    path.join(__dirname, "recorder", "launch.cjs"),
    "--user=" + options.user,
    "--device=" + options.device,
  ];
  if (options.snapshot === "enabled") {
    recorderArguments.push("--snapshot");
  }
  if (!options.record) {
    console.log("Recording skipped (--no-record). The spec is ready for business actions.");
    return;
  }

  console.log("Starting Recorder; copy its business actions into " + relativeSpec);
  const result = spawnSync(process.execPath, recorderArguments, {
    cwd: projectRoot,
    stdio: "inherit",
  });
  if (result.error) {
    throw new Error("Unable to start Recorder: " + result.error.message);
  }
  process.exitCode = result.status ?? 1;
}

try {
  main();
} catch (error) {
  console.error("New Playwright Test: " + error.message);
  process.exitCode = 1;
}
