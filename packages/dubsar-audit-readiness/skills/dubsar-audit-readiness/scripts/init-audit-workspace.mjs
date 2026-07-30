import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  parseArgs,
  prepareOutputDirectory,
  printFailure,
  printResult,
  PublicPluginError,
  writeJsonExclusive,
} from "./safe-io.mjs";

export async function initAuditWorkspace(
  output,
  caseId = `case-local-${randomUUID()}`,
) {
  if (!/^[a-z0-9][a-z0-9._-]{2,63}$/i.test(caseId)) {
    throw new PublicPluginError("INVALID_CASE_ID");
  }
  const root = await prepareOutputDirectory(output);

  const documents = {
    "audit-scope.json": {
      format: "dubsar.audit-scope/1",
      case_id: caseId,
      objective: "",
      in_scope: [],
      approved_evidence: [],
      excluded: [],
      time_window: null,
      completion_criteria: [],
      limitations: [],
      approval: null,
      status: "draft",
    },
    "automation-inventory.json": {
      format: "dubsar.automation-inventory/1",
      case_id: caseId,
      generated_from: [],
      items: [],
      gaps: [],
    },
    "sensitive-actions.json": {
      format: "dubsar.sensitive-actions/1",
      case_id: caseId,
      review_status: "pending",
      actions: [],
    },
    "evidence-index.json": {
      format: "dubsar.evidence-index/1",
      case_id: caseId,
      artifacts: [],
    },
    "evidence-review.json": {
      format: "dubsar.evidence-review/1",
      case_id: caseId,
      supported_observations: [],
      reported_statements: [],
      contradictions: [],
      missing_evidence: ["Scope has not been approved."],
      limitations: [],
      preparation_status: "not_ready",
    },
  };

  for (const [file, document] of Object.entries(documents)) {
    await writeJsonExclusive(root, file, document);
  }

  return {
    status: "initialized",
    case_id: caseId,
    files: Object.keys(documents).sort(),
  };
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2), ["output"]);
    printResult(await initAuditWorkspace(args.output, args["case-id"]));
  } catch (error) {
    printFailure(error);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
