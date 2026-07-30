import { fileURLToPath } from "node:url";
import { runAuditValidation } from "../skills/dubsar-audit-readiness/scripts/validate-audit-workspace.mjs";
import {
  parseArgs,
  printFailure,
  printResult,
} from "../skills/dubsar-audit-readiness/scripts/safe-io.mjs";

export { runAuditValidation };

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
