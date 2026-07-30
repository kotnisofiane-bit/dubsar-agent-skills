import { fileURLToPath } from "node:url";
import { exportAuditBundle } from "../skills/dubsar-audit-readiness/scripts/export-audit-bundle.mjs";
import {
  parseArgs,
  printFailure,
  printResult,
} from "../skills/dubsar-audit-readiness/scripts/safe-io.mjs";

export { exportAuditBundle };

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2), ["root", "output"]);
    printResult(await exportAuditBundle(args.root, args.output));
  } catch (error) {
    printFailure(error);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
