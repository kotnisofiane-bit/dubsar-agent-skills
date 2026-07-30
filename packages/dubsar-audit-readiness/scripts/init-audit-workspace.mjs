import { fileURLToPath } from "node:url";
import { initAuditWorkspace } from "../skills/dubsar-audit-readiness/scripts/init-audit-workspace.mjs";
import {
  parseArgs,
  printFailure,
  printResult,
} from "../skills/dubsar-audit-readiness/scripts/safe-io.mjs";

export { initAuditWorkspace };

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
