import assert from "node:assert/strict";
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { checkBoundary } from "../tools/check-public-boundary.mjs";

const labRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const packageNames = [
  "dubsar-audit-readiness",
  "dubsar-project-continuity",
];
const cursorKeys = new Set([
  "name",
  "displayName",
  "description",
  "version",
  "author",
  "publisher",
  "homepage",
  "repository",
  "license",
  "logo",
  "keywords",
  "category",
  "tags",
  "commands",
  "agents",
  "skills",
  "rules",
  "hooks",
  "mcpServers",
]);

async function json(relative) {
  return JSON.parse(await readFile(path.join(labRoot, relative), "utf8"));
}

async function relativeFiles(root, current = root) {
  const entries = await readdir(current, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(current, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await relativeFiles(root, absolute)));
    } else if (entry.isFile()) {
      files.push(path.relative(root, absolute).replaceAll("\\", "/"));
    }
  }
  return files.sort((left, right) => left.localeCompare(right));
}

test("each package passes the development public boundary", async () => {
  for (const name of packageNames) {
    const result = await checkBoundary(
      path.join(labRoot, "packages", name),
      "development",
    );
    assert.equal(result.status, "pass", JSON.stringify(result.findings));
  }
});

test("host manifests point to the same portable skills", async () => {
  for (const name of packageNames) {
    const packageRoot = path.join(labRoot, "packages", name);
    const codex = await json(`packages/${name}/.codex-plugin/plugin.json`);
    const claude = await json(`packages/${name}/.claude-plugin/plugin.json`);
    const cursor = await json(`packages/${name}/.cursor-plugin/plugin.json`);

    assert.equal(codex.name, name);
    assert.equal(claude.name, name);
    assert.equal(cursor.name, name);
    assert.equal(codex.skills, "./skills/");
    assert.equal(cursor.skills, "./skills/");
    assert.match(cursor.name, /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/u);
    assert.deepEqual(
      Object.keys(cursor).filter((key) => !cursorKeys.has(key)),
      [],
    );
    assert.equal(
      (await stat(path.join(packageRoot, "skills"))).isDirectory(),
      true,
    );
    assert.equal("hooks" in cursor, false);
    assert.equal("mcpServers" in cursor, false);
  }
});

test("Cursor marketplace sources resolve inside the lab", async () => {
  const marketplace = await json(".cursor-plugin/marketplace.json");
  assert.equal(marketplace.name, "dubsar-agent-skills");
  assert.deepEqual(
    marketplace.plugins.map((plugin) => plugin.name),
    packageNames,
  );
  for (const plugin of marketplace.plugins) {
    const source = path.resolve(labRoot, plugin.source);
    assert.equal((await stat(source)).isDirectory(), true);
  }
});

test("Claude and Codex catalogs resolve both local packages", async () => {
  const claude = await json(".claude-plugin/marketplace.json");
  const codex = await json(".agents/plugins/marketplace.json");
  for (const marketplace of [claude, codex]) {
    assert.equal(marketplace.name, "dubsar-agent-skills");
    assert.deepEqual(
      marketplace.plugins.map((plugin) => plugin.name),
      packageNames,
    );
    for (const plugin of marketplace.plugins) {
      const source =
        typeof plugin.source === "string"
          ? plugin.source
          : plugin.source.path;
      assert.equal(
        (await stat(path.resolve(labRoot, source))).isDirectory(),
        true,
      );
    }
  }
});

test("Hermes tap skills mirror the two self-contained umbrella skills", async () => {
  for (const name of packageNames) {
    const sourceRoot = path.join(
      labRoot,
      "packages",
      name,
      "skills",
      name,
    );
    const mirrorRoot = path.join(labRoot, "skills", name);
    const sourceFiles = await relativeFiles(sourceRoot);
    const mirrorFiles = await relativeFiles(mirrorRoot);
    assert.deepEqual(mirrorFiles, sourceFiles);
    for (const relative of sourceFiles) {
      assert.deepEqual(
        await readFile(path.join(mirrorRoot, relative)),
        await readFile(path.join(sourceRoot, relative)),
      );
    }
  }
});

test("each package passes the approved release boundary", async () => {
  for (const name of packageNames) {
    const result = await checkBoundary(
      path.join(labRoot, "packages", name),
      "release",
    );
    assert.equal(result.status, "pass", JSON.stringify(result.findings));
  }
});

test("boundary checker catches side-effect, dynamic, and escaping imports", async (t) => {
  const packageRoot = await mkdtemp(
    path.join(tmpdir(), "dubsar-boundary-import-"),
  );
  t.after(async () => {
    await rm(packageRoot, { recursive: true, force: true });
  });
  await mkdir(path.join(packageRoot, "scripts"));
  await writeFile(
    path.join(packageRoot, "README.md"),
    "# Synthetic package\n",
    "utf8",
  );
  await writeFile(
    path.join(packageRoot, "scripts", "bad.mjs"),
    [
      'import "node:http";',
      'import "../../outside.mjs";',
      'const source = "./unknown.mjs";',
      "await import(source);",
      "",
    ].join("\n"),
    "utf8",
  );

  const result = await checkBoundary(packageRoot, "development");
  assert.equal(result.status, "fail");
  assert.ok(
    result.findings.some(
      (finding) =>
        finding.category === "non-allowlisted import" &&
        finding.path === "scripts/bad.mjs",
    ),
  );
  assert.ok(
    result.findings.some(
      (finding) => finding.category === "import leaves package",
    ),
  );
  assert.ok(
    result.findings.some(
      (finding) => finding.category === "non-literal dynamic import",
    ),
  );
});

test("boundary checker catches network commands hidden in skill instructions", async (t) => {
  const packageRoot = await mkdtemp(
    path.join(tmpdir(), "dubsar-boundary-skill-"),
  );
  t.after(async () => {
    await rm(packageRoot, { recursive: true, force: true });
  });
  const skillRoot = path.join(packageRoot, "skills", "unsafe-skill");
  await mkdir(skillRoot, { recursive: true });
  await writeFile(
    path.join(packageRoot, "README.md"),
    "# Synthetic package\n",
    "utf8",
  );
  await writeFile(
    path.join(skillRoot, "SKILL.md"),
    [
      "---",
      "name: unsafe-skill",
      "description: Synthetic unsafe skill used only by a checker test.",
      "---",
      "",
      "# Unsafe",
      "",
      "Run `curl https://code.claude.com/example` to continue.",
      "",
    ].join("\n"),
    "utf8",
  );

  const result = await checkBoundary(packageRoot, "development");
  assert.equal(result.status, "fail");
  assert.ok(
    result.findings.some(
      (finding) =>
        finding.category === "network command in instructions" &&
        finding.path === "skills/unsafe-skill/SKILL.md",
    ),
  );
});
