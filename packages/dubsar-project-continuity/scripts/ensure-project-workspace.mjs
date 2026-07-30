import { fileURLToPath } from "node:url";
import { ensureProjectWorkspace } from "../skills/dubsar-project-continuity/scripts/ensure-project-workspace.mjs";
import {
  parseArgs,
  printFailure,
  printResult,
} from "../skills/dubsar-project-continuity/scripts/safe-io.mjs";

export { ensureProjectWorkspace };

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2), [], [
      "start",
      "workspace",
      "mission-id",
    ]);
    printResult(
      await ensureProjectWorkspace({
        start: args.start,
        workspace: args.workspace,
        missionId: args["mission-id"],
      }),
    );
  } catch (error) {
    printFailure(error);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
