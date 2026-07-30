import { fileURLToPath } from "node:url";
import { ensureAuditWorkspace } from "../skills/dubsar-audit-readiness/scripts/ensure-audit-workspace.mjs";
import {
  parseArgs,
  printFailure,
  printResult,
} from "../skills/dubsar-audit-readiness/scripts/safe-io.mjs";

export { ensureAuditWorkspace };

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
