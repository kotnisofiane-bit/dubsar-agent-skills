import { fileURLToPath } from "node:url";
import {
  openWorkspace,
  parseArgs,
  printFailure,
  printResult,
} from "./safe-io.mjs";
import { validateAuditWorkspace } from "./audit-model.mjs";

export async function runAuditValidation(input) {
  const root = await openWorkspace(input);
  return validateAuditWorkspace(root);
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2), ["root"]);
    const result = await runAuditValidation(args.root);
    printResult(result);
    if (
      result.status !== "valid" ||
      result.preparation_status !== "ready_for_human_review"
    ) {
      process.exitCode = 2;
    }
  } catch (error) {
    printFailure(error);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
