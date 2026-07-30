import { fileURLToPath } from "node:url";
import { renderProjectSummary } from "../skills/dubsar-project-continuity/scripts/render-project-summary.mjs";
import {
  parseArgs,
  printFailure,
  printResult,
} from "../skills/dubsar-project-continuity/scripts/safe-io.mjs";

export { renderProjectSummary };

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2), ["root", "output"]);
    printResult(await renderProjectSummary(args.root, args.output));
  } catch (error) {
    printFailure(error);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
