import { lstat, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initAuditWorkspace } from "./init-audit-workspace.mjs";
import { runAuditValidation } from "./validate-audit-workspace.mjs";
import {
  canonicalCandidate,
  isInsideOrEqual,
  openWorkspace,
  parseArgs,
  printFailure,
  printResult,
  PublicPluginError,
  readJson,
  safeChild,
} from "./safe-io.mjs";

const MARKER = ".dubsar-audit";
const REQUIRED_FILES = [
  "audit-scope.json",
  "automation-inventory.json",
  "sensitive-actions.json",
  "evidence-index.json",
  "evidence-review.json",
];
const CASE_ID_PATTERN = /^[a-z0-9][a-z0-9._-]{2,63}$/iu;

function samePath(left, right) {
  return isInsideOrEqual(left, right) && isInsideOrEqual(right, left);
}

async function entryInfo(target) {
  try {
    return await lstat(target);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return null;
    }
    throw new PublicPluginError("PATH_INSPECTION_FAILED");
  }
}

async function findProjectContext(startInput) {
  const start = await openWorkspace(startInput ?? process.cwd());
  let current = start;

  while (true) {
    const gitMarker = path.join(current, ".git");
    const info = await entryInfo(gitMarker);
    if (info) {
      if (
        info.isSymbolicLink() ||
        (!info.isDirectory() && !info.isFile())
      ) {
        throw new PublicPluginError("PROJECT_MARKER_UNSAFE");
      }
      return { projectRoot: current, start };
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return { projectRoot: start, start };
    }
    current = parent;
  }
}

async function findNearestMarker(projectRoot, start) {
  let current = start;

  while (isInsideOrEqual(projectRoot, current)) {
    const candidate = safeChild(current, MARKER);
    const info = await entryInfo(candidate);
    if (info) {
      if (info.isSymbolicLink()) {
        throw new PublicPluginError("SYMLINK_ANCESTOR_REJECTED");
      }
      if (!info.isDirectory()) {
        throw new PublicPluginError("WORKSPACE_NOT_DIRECTORY");
      }
      const workspaceRoot = await openWorkspace(candidate);
      if (!isInsideOrEqual(projectRoot, workspaceRoot)) {
        throw new PublicPluginError("WORKSPACE_OUTSIDE_PROJECT");
      }
      return workspaceRoot;
    }
    if (samePath(current, projectRoot)) {
      break;
    }
    current = path.dirname(current);
  }
  return null;
}

async function resolveExplicitWorkspace(projectRoot, start, workspace) {
  const unresolved = path.isAbsolute(workspace)
    ? workspace
    : safeChild(start, workspace);
  const candidate = await canonicalCandidate(unresolved);
  if (!isInsideOrEqual(projectRoot, candidate)) {
    throw new PublicPluginError("WORKSPACE_OUTSIDE_PROJECT");
  }
  if (path.basename(candidate) !== MARKER) {
    throw new PublicPluginError("INVALID_WORKSPACE_MARKER");
  }
  return candidate;
}

function relativeWorkspace(projectRoot, start, workspaceRoot) {
  if (
    !isInsideOrEqual(projectRoot, start) ||
    !isInsideOrEqual(projectRoot, workspaceRoot)
  ) {
    throw new PublicPluginError("WORKSPACE_OUTSIDE_PROJECT");
  }
  const relative = path
    .relative(start, workspaceRoot)
    .replaceAll("\\", "/");
  return relative || ".";
}

async function readCaseId(workspaceRoot) {
  let caseId = null;
  for (const file of REQUIRED_FILES) {
    const document = await readJson(workspaceRoot, file);
    if (
      typeof document?.case_id !== "string" ||
      !CASE_ID_PATTERN.test(document.case_id)
    ) {
      throw new PublicPluginError("INVALID_CASE_ID");
    }
    if (caseId !== null && document.case_id !== caseId) {
      throw new PublicPluginError("CASE_ID_MISMATCH");
    }
    caseId = document.case_id;
  }
  return caseId;
}

async function assertValidWorkspace(workspaceRoot) {
  const validation = await runAuditValidation(workspaceRoot);
  if (validation.status !== "valid") {
    throw new PublicPluginError("WORKSPACE_INVALID");
  }
}

async function inspectWorkspace(candidate) {
  const info = await entryInfo(candidate);
  if (!info) {
    return { exists: false, root: candidate };
  }
  const root = await openWorkspace(candidate);
  if ((await readdir(root)).length === 0) {
    throw new PublicPluginError("WORKSPACE_INCOMPLETE");
  }
  return { exists: true, root };
}

export async function ensureAuditWorkspace({
  start,
  workspace,
  caseId,
} = {}) {
  const context = await findProjectContext(start);
  let candidate;

  if (workspace !== undefined) {
    candidate = await resolveExplicitWorkspace(
      context.projectRoot,
      context.start,
      workspace,
    );
  } else {
    candidate =
      (await findNearestMarker(context.projectRoot, context.start)) ??
      (await canonicalCandidate(safeChild(context.projectRoot, MARKER)));
  }

  const existing = await inspectWorkspace(candidate);
  if (existing.exists) {
    const existingCaseId = await readCaseId(existing.root);
    await assertValidWorkspace(existing.root);
    if (caseId !== undefined && caseId !== existingCaseId) {
      throw new PublicPluginError("CASE_ID_CONFLICT");
    }
    return {
      status: "reused",
      case_id: existingCaseId,
      workspace: relativeWorkspace(
        context.projectRoot,
        context.start,
        existing.root,
      ),
    };
  }

  const initialized = await initAuditWorkspace(existing.root, caseId);
  const workspaceRoot = await openWorkspace(existing.root);
  const storedCaseId = await readCaseId(workspaceRoot);
  await assertValidWorkspace(workspaceRoot);
  if (storedCaseId !== initialized.case_id) {
    throw new PublicPluginError("CASE_ID_MISMATCH");
  }
  return {
    status: "initialized",
    case_id: storedCaseId,
    workspace: relativeWorkspace(
      context.projectRoot,
      context.start,
      workspaceRoot,
    ),
  };
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2), [], [
      "start",
      "workspace",
      "case-id",
    ]);
    printResult(
      await ensureAuditWorkspace({
        start: args.start,
        workspace: args.workspace,
        caseId: args["case-id"],
      }),
    );
  } catch (error) {
    printFailure(error);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
