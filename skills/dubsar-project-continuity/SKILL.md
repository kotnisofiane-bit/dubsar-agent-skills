---
name: dubsar-project-continuity
description: Keep a significant project bounded, evidence-aware, and safely resumable across conversations and agent hosts through an automatically reused local mission workspace, lots, an execution contract, evidence records, and a deterministic handoff. Use for the complete lightweight continuity workflow or as the portable Hermes umbrella skill; prefer a specialized skill for one step.
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
- the current working project and an optional explicit continuity-workspace
  override;
- any existing mission, lot, contract, evidence, or handoff artifacts.

## Workflow

1. Resolve continuity before creating it with
   `scripts/ensure-project-workspace.mjs --start <current-directory>`.
   The helper stays inside the nearest Git project, reuses the nearest ancestor
   `.dubsar-project`, or initializes one at the project root and generates its
   identifier. Without a Git root, the supplied start directory is the
   boundary. If the user's request is a genuinely different mission, ask for
   that material separation before reuse, then use `--workspace` once to
   create an exact marker in a dedicated in-project directory.
2. Record the desired outcome, scope, exclusions, acceptance evidence, risks,
   and stop conditions in `mission.json`.
3. Split an approved mission into ordered, independently verifiable entries in
   `lots.json`.
4. Select one candidate lot and define its exact execution boundary in
   `execution-contract.json`.
5. Append observed, reported, derived, or unverified claims to `evidence.json`.
6. Validate identifiers, dependencies, evidence references, and contract state.
7. Render a stable handoff that states facts, limitations, the next preparation
   step, and actions that remain unauthorized.

Read [the data contracts](references/data-contracts.md) before creating or
repairing the JSON files.

## Local helpers

The scripts use Node.js built-ins only:

```bash
node scripts/ensure-project-workspace.mjs --start .
node scripts/validate-project-workspace.mjs --root ./.dubsar-project
node scripts/render-project-summary.mjs --root ./.dubsar-project --output ./handoff
```

Users do not need to name or remember an identifier. Resolve the returned
`workspace` against the same `--start` directory, then pass that canonical
local path to later helpers without exposing it in the user-facing result.
Rendering a summary never starts the next lot.

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
- Reuse recorded identifiers. Generate a `mission_id` only while initializing
  a genuinely new or pre-existing project without continuity files.
- Keep one active mission workspace per directory scope. Never recycle an old
  identifier for a different mission.
- Treat linked, partial, or malformed workspaces, invalid explicit overrides,
  identifier mismatches, and contradictory evidence as blockers.
- Do not deploy, merge, send, synchronize, or execute project work from this
  skill.
- Stop when identifiers or evidence conflict and request human resolution.
- A contract documents intent; it does not expand the user's authorization.

## Example invocation

`Use $dubsar-project-continuity to frame this project, decompose it into verifiable lots, and prepare a resumable local handoff.`
