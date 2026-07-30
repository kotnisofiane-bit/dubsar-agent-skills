import path from "node:path";
import { fileURLToPath } from "node:url";
import { runAuditValidation } from "../packages/dubsar-audit-readiness/scripts/validate-audit-workspace.mjs";
import { runProjectValidation } from "../packages/dubsar-project-continuity/scripts/validate-project-workspace.mjs";

export async function runDemo(root) {
  const audit = await runAuditValidation(
    path.join(root, "examples", "audit-readiness"),
  );
  const project = await runProjectValidation(
    path.join(root, "examples", "project-continuity"),
  );
  return {
    status:
      audit.status === "valid" &&
      audit.preparation_status === "ready_for_human_review" &&
      project.status === "valid"
        ? "pass"
        : "fail",
    audit: {
      structural_status: audit.status,
      preparation_status: audit.preparation_status,
      counts: audit.counts,
      disclaimer: "No audit result or certification was produced.",
    },
    project: {
      continuity_status: project.continuity_status,
      counts: project.counts,
      next_preparation_step: project.next_preparation_step,
      disclaimer: "No project action was executed or authorized.",
    },
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const result = await runDemo(root);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.status !== "pass") {
    process.exitCode = 1;
  }
}
