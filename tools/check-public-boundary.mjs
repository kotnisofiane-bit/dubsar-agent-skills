import { lstat, readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ALLOWED_EXTENSIONS = new Set([".json", ".md", ".mjs", ".yaml"]);
const ALLOWED_ROOT_FILES = new Set([
  "README.md",
  "PROVENANCE.json",
  "FILES.sha256.json",
  "LICENSE",
  "LICENSE.md",
]);
const ALLOWED_MANIFEST_DIRS = new Set([
  ".codex-plugin",
  ".claude-plugin",
  ".cursor-plugin",
]);
const FORBIDDEN_FILENAMES = [
  /^\.env(?:\.|$)/i,
  /^\.mcp\.json$/i,
  /^mcp\.json$/i,
  /^credentials/i,
  /^secrets/i,
  /^bearer/i,
  /^runtime.*\.json$/i,
  /^\.npmrc$/i,
  /^\.pypirc$/i,
  /^\.netrc$/i,
  /^auth\.json$/i,
  /^config\.local\./i,
  /^dockerfile$/i,
  /^compose.*\.ya?ml$/i,
  /^docker-compose/i,
  /^wrangler/i,
  /^\.gitmodules$/i,
];
const FORBIDDEN_EXTENSIONS = new Set([
  ".exe",
  ".dll",
  ".node",
  ".zip",
  ".tar",
  ".7z",
  ".pem",
  ".key",
  ".p12",
  ".pfx",
]);
const COMMERCIAL_ACTIVATION = [
  "license_key",
  "activation_key",
  "activation_token",
  "entitlement",
];
const HOOK_TOKENS = [
  "PreToolUse",
  "PostToolUse",
  "SessionStart",
  "SessionEnd",
  "PreCompact",
];
const EXECUTABLE_CODE_EXTENSIONS = new Set([".mjs"]);
const ALLOWED_CODE_IMPORTS = new Set([
  "node:fs/promises",
  "node:path",
  "node:crypto",
  "node:url",
]);
const ALLOWED_DOCUMENT_DOMAINS = new Set([
  "agentskills.io",
  "code.claude.com",
  "cursor.com",
  "github.com",
  "hermes-agent.nousresearch.com",
  "opensource.org",
  "spdx.org",
  "dupsar.ai",
]);
// Release policy approved after the clean-room and licence review.
const APPROVED_RELEASE_SPDX_IDS = new Set(["MIT"]);

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const token = argv[index];
    const value = argv[index + 1];
    if (!token?.startsWith("--") || value === undefined) {
      throw new Error("INVALID_ARGUMENTS");
    }
    values[token.slice(2)] = value;
  }
  if (!values.root || !["development", "release"].includes(values.mode)) {
    throw new Error("INVALID_ARGUMENTS");
  }
  return values;
}

function relativePath(root, target) {
  return path.relative(root, target).replaceAll("\\", "/");
}

function addFinding(findings, rule, relative, category, line) {
  findings.push({
    rule,
    path: relative,
    ...(line ? { line } : {}),
    category,
  });
}

function pathAllowed(relative) {
  const parts = relative.split("/");
  if (parts.length === 1) {
    return ALLOWED_ROOT_FILES.has(parts[0]);
  }
  if (ALLOWED_MANIFEST_DIRS.has(parts[0])) {
    return parts.length === 2 && parts[1] === "plugin.json";
  }
  if (parts[0] === "scripts") {
    return parts.length === 2 && path.extname(parts[1]) === ".mjs";
  }
  if (parts[0] !== "skills" || parts.length < 3) {
    return false;
  }
  if (parts.length === 3 && parts[2] === "SKILL.md") {
    return true;
  }
  if (
    parts.length === 4 &&
    parts[2] === "agents" &&
    parts[3] === "openai.yaml"
  ) {
    return true;
  }
  if (
    parts.length === 4 &&
    parts[2] === "scripts" &&
    path.extname(parts[3]) === ".mjs"
  ) {
    return true;
  }
  return (
    parts.length === 4 &&
    parts[2] === "references" &&
    path.extname(parts[3]) === ".md"
  );
}

async function collectFiles(root, current, findings) {
  const files = [];
  for (const entry of await readdir(current, { withFileTypes: true })) {
    const absolute = path.join(current, entry.name);
    const relative = relativePath(root, absolute);
    const info = await lstat(absolute);
    if (info.isSymbolicLink()) {
      addFinding(findings, "PB001", relative, "symbolic link");
      continue;
    }
    if (entry.isDirectory()) {
      if (
        entry.name === "hooks" ||
        entry.name === "node_modules" ||
        entry.name === ".git"
      ) {
        addFinding(findings, "PB010", relative, "forbidden directory");
        continue;
      }
      files.push(...(await collectFiles(root, absolute, findings)));
      continue;
    }
    files.push({ absolute, relative });
  }
  return files;
}

function scanLines(text, relative, findings) {
  const lines = text.split(/\r?\n/u);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const lower = line.toLowerCase();
    for (const token of COMMERCIAL_ACTIVATION) {
      if (lower.includes(token)) {
        addFinding(
          findings,
          "PB050",
          relative,
          "commercial activation",
          index + 1,
        );
      }
    }
    for (const token of HOOK_TOKENS) {
      if (line.includes(token)) {
        addFinding(findings, "PB010", relative, "hook token", index + 1);
      }
    }
    if (/(?:[A-Za-z]:\\Users\\|\/home\/[^/]+\/|\/Users\/[^/]+\/)/u.test(line)) {
      addFinding(findings, "PB060", relative, "absolute user path", index + 1);
    }
    if (
      /(?:sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16}|-----BEGIN [A-Z ]+ PRIVATE KEY-----)/u.test(
        line,
      )
    ) {
      addFinding(findings, "PB060", relative, "credential pattern", index + 1);
    }
  }
}

function comparablePath(input) {
  const resolved = path.resolve(input);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}

function isInsideOrEqual(root, candidate) {
  const parent = comparablePath(root);
  const child = comparablePath(candidate);
  return child === parent || child.startsWith(`${parent}${path.sep}`);
}

async function scanExecutableCode(
  text,
  relative,
  absolute,
  root,
  findings,
) {
  const staticImports = [
    ...text.matchAll(
      /\bimport\s+(?:[^"'();]+?\s+from\s+)?["']([^"']+)["']/gu,
    ),
    ...text.matchAll(
      /\bexport\s+[^"'();]+?\s+from\s+["']([^"']+)["']/gu,
    ),
  ].map((match) => match[1]);
  const dynamicLiteralMatches = [
    ...text.matchAll(/\bimport\s*\(\s*["']([^"']+)["']\s*\)/gu),
  ];
  const dynamicCallCount = [...text.matchAll(/\bimport\s*\(/gu)].length;
  if (dynamicCallCount !== dynamicLiteralMatches.length) {
    addFinding(findings, "PB070", relative, "non-literal dynamic import");
  }
  const imports = [
    ...new Set([
      ...staticImports,
      ...dynamicLiteralMatches.map((match) => match[1]),
    ]),
  ];
  for (const source of imports) {
    if (source.startsWith(".")) {
      const resolvedImport = path.resolve(path.dirname(absolute), source);
      if (!isInsideOrEqual(root, resolvedImport)) {
        addFinding(findings, "PB070", relative, "import leaves package");
        continue;
      }
      try {
        const info = await lstat(resolvedImport);
        if (!info.isFile() || info.isSymbolicLink()) {
          addFinding(findings, "PB070", relative, "unsafe relative import");
        }
      } catch {
        addFinding(findings, "PB070", relative, "missing relative import");
      }
    } else if (!ALLOWED_CODE_IMPORTS.has(source)) {
      addFinding(findings, "PB070", relative, "non-allowlisted import");
    }
  }
  const checks = [
    ["PB040", /\bfetch\s*\(/u, "network call"],
    ["PB040", /\b(?:axios|WebSocket|EventSource)\b/u, "network client"],
    ["PB070", /\bchild_process\b/u, "process execution"],
    ["PB070", /\b(?:exec|spawn|eval)\s*\(/u, "dynamic execution"],
    ["PB070", /\bnew\s+Function\b/u, "dynamic function"],
    ["PB070", /\brequire\s*\(/u, "CommonJS loader"],
    ["PB070", /\bprocess\.env\b/u, "environment access"],
    ["PB070", /\b(?:unlink|rmdir|rm)\s*\(/u, "deletion"],
  ];
  for (const [rule, pattern, category] of checks) {
    if (pattern.test(text)) {
      addFinding(findings, rule, relative, category);
    }
  }
  if (/https?:\/\//u.test(text)) {
    addFinding(findings, "PB040", relative, "URL in executable code");
  }
}

function scanInstructionText(text, relative, findings) {
  const checks = [
    [
      "PB040",
      /(?:^|`)\s*(?:[-*]\s+)?(?:[$>]\s*)?(?:curl|wget|Invoke-WebRequest|Invoke-RestMethod|ftp|scp|ssh|nc)\b/imu,
      "network command in instructions",
    ],
    [
      "PB070",
      /(?:^|`)\s*(?:[-*]\s+)?(?:[$>]\s*)?(?:powershell|pwsh|cmd\s+\/c|bash\s+-c|sh\s+-c|npx|npm\s+install|pip\s+install|uv\s+pip\s+install)\b/imu,
      "unapproved process command in instructions",
    ],
    [
      "PB070",
      /\b(?:process\.env|os\.environ|getenv\s*\(|\$env:)/iu,
      "environment access in instructions",
    ],
    [
      "PB040",
      /(?:^|`)\s*(?:[-*]\s+)?(?:[$>]\s*)?(?:git\s+push|gh\s+release|aws\s+s3|az\s+storage|gcloud\s+storage)\b/imu,
      "upload command in instructions",
    ],
  ];
  for (const [rule, pattern, category] of checks) {
    if (pattern.test(text)) {
      addFinding(findings, rule, relative, category);
    }
  }
}

function scanDocumentUrls(text, relative, findings) {
  for (const match of text.matchAll(/https?:\/\/([^/\s"')]+)/gu)) {
    if (!ALLOWED_DOCUMENT_DOMAINS.has(match[1].toLowerCase())) {
      addFinding(findings, "PB040", relative, "non-allowlisted URL");
    }
  }
}

function inspectJson(text, relative, findings) {
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    addFinding(findings, "PB001", relative, "invalid JSON");
    return;
  }
  const serialized = JSON.stringify(value);
  if (
    /"(?:hooks|mcpServers|mcp_tools|toolRouter)"\s*:/u.test(serialized)
  ) {
    addFinding(findings, "PB010", relative, "forbidden manifest key");
  }
}

async function validateReleaseMetadata(root, files, findings) {
  const byName = new Map(files.map((file) => [file.relative, file]));
  const licenceFile = byName.get("LICENSE") ?? byName.get("LICENSE.md");
  if (!licenceFile) {
    addFinding(findings, "PB100", "LICENSE", "missing approved licence");
  }

  let provenance = null;
  const provenanceFile = byName.get("PROVENANCE.json");
  if (!provenanceFile) {
    addFinding(findings, "PB100", "PROVENANCE.json", "missing provenance");
  } else {
    try {
      provenance = JSON.parse(await readFile(provenanceFile.absolute, "utf8"));
    } catch {
      addFinding(findings, "PB100", "PROVENANCE.json", "invalid provenance");
    }
  }

  const spdx = provenance?.license_spdx;
  if (
    provenance?.status !== "approved" ||
    provenance?.release_review !== "approved" ||
    typeof spdx !== "string" ||
    !/^[A-Za-z0-9.+-]+$/u.test(spdx) ||
    !APPROVED_RELEASE_SPDX_IDS.has(spdx)
  ) {
    addFinding(
      findings,
      "PB100",
      "PROVENANCE.json",
      "provenance not release-approved",
    );
  }
  if (licenceFile) {
    const licenceText = await readFile(licenceFile.absolute, "utf8");
    if (licenceText.trim().length < 100) {
      addFinding(findings, "PB100", licenceFile.relative, "invalid licence");
    }
  }
  for (const manifestPath of [
    ".claude-plugin/plugin.json",
    ".cursor-plugin/plugin.json",
  ]) {
    const manifestFile = byName.get(manifestPath);
    if (!manifestFile) {
      continue;
    }
    try {
      const manifest = JSON.parse(
        await readFile(manifestFile.absolute, "utf8"),
      );
      if (manifest.license !== spdx) {
        addFinding(
          findings,
          "PB100",
          manifestPath,
          "manifest licence mismatch",
        );
      }
    } catch {
      addFinding(findings, "PB100", manifestPath, "invalid manifest");
    }
  }

  const inventoryFile = byName.get("FILES.sha256.json");
  if (!inventoryFile) {
    addFinding(
      findings,
      "PB100",
      "FILES.sha256.json",
      "missing file inventory",
    );
    return;
  }
  let inventory;
  try {
    inventory = JSON.parse(await readFile(inventoryFile.absolute, "utf8"));
  } catch {
    addFinding(
      findings,
      "PB100",
      "FILES.sha256.json",
      "invalid file inventory",
    );
    return;
  }
  const expectedFiles = files
    .filter((file) => file.relative !== "FILES.sha256.json")
    .sort((left, right) => left.relative.localeCompare(right.relative));
  const actualEntries = [];
  for (const file of expectedFiles) {
    actualEntries.push({
      path: file.relative,
      sha256: createHash("sha256")
        .update(await readFile(file.absolute))
        .digest("hex"),
    });
  }
  const rootLines = actualEntries
    .map((entry) => `${entry.sha256}  ${entry.path}\n`)
    .join("");
  const actualRoot = createHash("sha256")
    .update(rootLines, "utf8")
    .digest("hex");
  if (
    inventory?.format !== "dubsar.public-file-inventory/1" ||
    JSON.stringify(inventory.files) !== JSON.stringify(actualEntries) ||
    inventory.root_sha256 !== actualRoot
  ) {
    addFinding(
      findings,
      "PB100",
      "FILES.sha256.json",
      "file inventory mismatch",
    );
  }
}

export async function checkBoundary(rootInput, mode) {
  const root = path.resolve(rootInput);
  const findings = [];
  const rootInfo = await lstat(root);
  if (!rootInfo.isDirectory() || rootInfo.isSymbolicLink()) {
    throw new Error("INVALID_ROOT");
  }
  const files = await collectFiles(root, root, findings);

  for (const file of files) {
    const basename = path.basename(file.relative);
    const extension = path.extname(basename).toLowerCase();
    if (!pathAllowed(file.relative)) {
      addFinding(findings, "PB001", file.relative, "path not allowlisted");
    }
    if (
      FORBIDDEN_FILENAMES.some((pattern) => pattern.test(basename)) ||
      FORBIDDEN_EXTENSIONS.has(extension)
    ) {
      addFinding(findings, "PB001", file.relative, "forbidden file type");
      continue;
    }
    if (
      !ALLOWED_EXTENSIONS.has(extension) &&
      !["LICENSE"].includes(basename)
    ) {
      addFinding(findings, "PB001", file.relative, "extension not allowlisted");
      continue;
    }

    const text = await readFile(file.absolute, "utf8");
    scanLines(text, file.relative, findings);
    if (EXECUTABLE_CODE_EXTENSIONS.has(extension)) {
      await scanExecutableCode(
        text,
        file.relative,
        file.absolute,
        root,
        findings,
      );
    } else {
      scanDocumentUrls(text, file.relative, findings);
      if (extension === ".md" || extension === ".yaml") {
        scanInstructionText(text, file.relative, findings);
      }
    }
    if (extension === ".json") {
      inspectJson(text, file.relative, findings);
    }
  }

  if (mode === "release") {
    await validateReleaseMetadata(root, files, findings);
  }

  const ordered = findings.sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.rule.localeCompare(right.rule) ||
      (left.line ?? 0) - (right.line ?? 0),
  );
  return {
    status: ordered.length === 0 ? "pass" : "fail",
    mode,
    files_scanned: files.length,
    findings: ordered,
  };
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = await checkBoundary(args.root, args.mode);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    if (result.status !== "pass") {
      process.exitCode = 1;
    }
  } catch {
    process.stderr.write(
      `${JSON.stringify({ status: "error", code: "BOUNDARY_CHECK_FAILED" })}\n`,
    );
    process.exitCode = 1;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
