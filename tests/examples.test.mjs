import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runDemo } from "../tools/run-demo.mjs";

const labRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

test("public synthetic examples pass without producing an audit verdict", async () => {
  const result = await runDemo(labRoot);
  assert.equal(result.status, "pass");
  assert.equal(
    result.audit.preparation_status,
    "ready_for_human_review",
  );
  assert.equal(result.project.continuity_status, "continuity_valid");
  assert.match(result.audit.disclaimer, /No audit result/u);
  assert.match(result.project.disclaimer, /No project action/u);
});
