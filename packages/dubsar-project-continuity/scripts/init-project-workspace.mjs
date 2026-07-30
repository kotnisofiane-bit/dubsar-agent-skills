import { fileURLToPath } from "node:url";
import { initProjectWorkspace } from "../skills/dubsar-project-continuity/scripts/init-project-workspace.mjs";
import {
  parseArgs,
  printFailure,
  printResult,
} from "../skills/dubsar-project-continuity/scripts/safe-io.mjs";

export { initProjectWorkspace };

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2), ["output"]);
    printResult(await initProjectWorkspace(args.output, args["mission-id"]));
  } catch (error) {
    printFailure(error);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
