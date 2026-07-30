import { spawnSync } from "node:child_process";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const testsDirectory = path.join(repositoryRoot, "tests");
const entries = await readdir(testsDirectory, { withFileTypes: true });
const testFiles = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".test.mjs"))
  .map((entry) => path.join(testsDirectory, entry.name))
  .sort((left, right) => left.localeCompare(right, "en"));

if (testFiles.length === 0) {
  throw new Error("No test files found.");
}

const result = spawnSync(process.execPath, ["--test", ...testFiles], {
  cwd: repositoryRoot,
  stdio: "inherit",
  windowsHide: true,
});

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
