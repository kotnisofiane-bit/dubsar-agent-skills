---
name: dubsar-project-continuity
description: Keep a significant project bounded, evidence-aware, and safely resumable through a mission, lots, an execution contract, evidence records, and a deterministic handoff. Use when the user requests the complete end-to-end workflow or installs the DUBSAR pack as one portable Hermes skill; prefer a specialized skill for a single step.
---

# DUBSAR Project Continuity

## Objective

Preserve project intent and proof across sessions, people, and agent hosts
without granting new execution authority.

For a single step, prefer `frame-project-mission`,
`decompose-project-lots`, `draft-execution-contract`,
`record-project-evidence`, or `resume-project-context`.

## Inputs

- the user's desired outcome, constraints, exclusions, and acceptance signals;
- an explicit local workspace path;
- any existing mission, lot, contract, evidence, or handoff artifacts.

## Workflow

1. Record the desired outcome, scope, exclusions, acceptance evidence, risks,
   and stop conditions in `mission.json`.
2. Split an approved mission into ordered, independently verifiable entries in
   `lots.json`.
3. Select one candidate lot and define its exact execution boundary in
   `execution-contract.json`.
4. Append observed, reported, derived, or unverified claims to `evidence.json`.
5. Validate identifiers, dependencies, evidence references, and contract state.
6. Render a stable handoff that states facts, limitations, the next preparation
   step, and actions that remain unauthorized.

Read [the data contracts](references/data-contracts.md) before creating or
repairing the JSON files.

## Local helpers

The scripts use Node.js built-ins only:

```bash
node scripts/init-project-workspace.mjs --output ./.dubsar-project
node scripts/validate-project-workspace.mjs --root ./.dubsar-project
node scripts/render-project-summary.mjs --root ./.dubsar-project --output ./handoff
```

Always pass explicit paths. Rendering a summary never starts the next lot.

## Output

Produce or update the four continuity files and, when requested, a deterministic
handoff summary. Report:

- continuity as `continuity_valid` or `continuity_blocked`;
- the evidence-backed current lot;
- every unresolved contradiction;
- the next preparation step;
- the summary and source digests, if rendered.

## Limits

- Do not infer completion from a plan, diff, command, or agent statement alone.
- Do not merge contradictory missions or create missing identifiers.
- Do not deploy, merge, send, synchronize, or execute project work from this
  skill.
- Stop when identifiers or evidence conflict and request human resolution.
- A contract documents intent; it does not expand the user's authorization.

## Example invocation

`Use $dubsar-project-continuity to frame this project, decompose it into verifiable lots, and prepare a resumable local handoff.`
