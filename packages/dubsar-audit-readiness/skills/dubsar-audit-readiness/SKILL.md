---
name: dubsar-audit-readiness
description: "Run the complete local audit-readiness workflow for automations or AI agents: scope, evidence index, inventory, sensitive actions, evidence gaps, validation, and deterministic export. Use when the user requests end-to-end preparation for human review; use a specialized skill for only one phase."
---

# DUBSAR Audit Readiness

## Objective

Prepare a coherent local evidence workspace for human review without claiming
that the audited system passed.

For a single step, prefer `frame-audit-scope`, `inventory-automations`,
`map-sensitive-actions`, `review-evidence-gaps`, or `export-audit-bundle`.

## Inputs

- an explicit local workspace path and, if export is requested, a separate
  output path;
- user-approved local evidence and its source context;
- the business question, scope, exclusions, time window, and completion
  criteria;
- human decisions needed for scope approval and sensitive-action review.

Do not invent approval attribution. Accept only a user-provided role or
pseudonymous identifier, UTC timestamp, and local reference.

## Workflow

1. Read [the data contracts](references/data-contracts.md).
2. Initialize the workspace or inspect the five existing case files.
3. Frame the objective, approved evidence, exclusions, time window, completion
   criteria, limitations, and attributable scope approval in
   `audit-scope.json`.
4. Index approved regular local files and their SHA-256 values in
   `evidence-index.json`.
5. Inventory only evidence-supported automations and agents in
   `automation-inventory.json`.
6. Map material effects and proposed review points in
   `sensitive-actions.json`; require human review even when the map is empty.
7. Separate observations, reports, contradictions, gaps, and limitations in
   `evidence-review.json`; link every supported observation to one or more
   indexed artifact IDs.
8. Validate the workspace. Preserve every reported finding and readiness
   reason.
9. Export only after validation reports `valid` and
   `ready_for_human_review`, and the user confirms the included files.

## Local helpers

The scripts use Node.js built-ins only:

```bash
node scripts/init-audit-workspace.mjs --output ./audit-case
node scripts/validate-audit-workspace.mjs --root ./audit-case
node scripts/export-audit-bundle.mjs --root ./audit-case --output ./audit-bundle
```

Always pass explicit paths.

## Output

Produce or update the five contract files. If export is requested and allowed,
also produce `MANIFEST.sha256.json`. Report:

- the structural validation status;
- readiness reasons and unresolved gaps;
- the exported file count and root SHA-256, if exported;
- the disclaimer that no audit result or certification was produced.

## Boundaries

- Use only approved local evidence; make no network calls and request no
  credentials.
- Do not run or modify automations, write to production, use hooks, start
  background work, upload files, or require MCP or DUBSAR Core.
- Treat `ready_for_human_review` as a preparation state, not a compliance,
  legal, safety, or audit verdict.
- Treat digests as byte-integrity evidence only.
- Do not move or overwrite an existing non-empty workspace or output.

## Example invocation

> Use `$dubsar-audit-readiness` to prepare the local evidence in
> `./evidence` as case `case-payments-01`, validate it, and export a bundle to
> `./audit-bundle` only if it is ready for human review.
