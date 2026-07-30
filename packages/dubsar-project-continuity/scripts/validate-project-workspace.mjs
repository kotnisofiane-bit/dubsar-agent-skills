import { fileURLToPath } from "node:url";
import { runProjectValidation } from "../skills/dubsar-project-continuity/scripts/validate-project-workspace.mjs";
import {
  parseArgs,
  printFailure,
  printResult,
} from "../skills/dubsar-project-continuity/scripts/safe-io.mjs";

export { runProjectValidation };

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2), ["root"]);
    const result = await runProjectValidation(args.root);
    printResult(result);
    if (result.status !== "valid") {
      process.exitCode = 2;
    }
  } catch (error) {
    printFailure(error);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
