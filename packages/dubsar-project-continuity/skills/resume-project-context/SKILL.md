---
name: resume-project-context
description: Automatically locate the nearest local continuity workspace and reconstruct project state from its portable mission, lots, execution contract, and evidence files without inventing progress. Use after context compression, a new conversation, interruption, tool change, handoff, or uncertainty about completion.
---

# Resume Project Context

## Objective

Recover a safe starting point from recorded facts rather than conversational
memory.

## Inputs

- the current project and an optional explicit continuity-workspace override;
- an explicit output path when a rendered handoff is requested.

## Workflow

1. Run the complete pack's `ensure-project-workspace.mjs` with `--start`
   pointing to the current directory. It stays inside the nearest Git project
   and returns the nearest ancestor `.dubsar-project`, or initializes one if
   none exists. Use an explicit in-project `--workspace` marker only when
   requested. Resolve the returned path against that same start directory
   before validation; do not ask the user to handle it.
2. If the repository contains pre-existing work but no continuity workspace,
   initialize one local non-canonical record with a freshly generated
   `mission_id`. Record only observable current state and reported or
   unverified history. Never fabricate earlier Core, session, execution,
   approval, or evidence records.
3. When the complete pack is installed, run
   `../dubsar-project-continuity/scripts/validate-project-workspace.mjs --root <workspace>`;
   otherwise inspect the four input files manually.
4. Read `mission.json`, `lots.json`, `execution-contract.json`, and
   `evidence.json`.
5. Confirm that mission, lot, and contract identifiers agree.
6. Identify the last lot whose required evidence is actually present.
7. Separate completed, partial, planned, blocked, and unknown work.
8. Surface contradictions and do not resolve them by inference.
9. Name the next preparation step and the authority still required.
10. When the helper is available, render a stable handoff with
   `../dubsar-project-continuity/scripts/render-project-summary.mjs --root <workspace> --output <target>`.

## Resume rules

- Never synthesize a missing `lot_id` or `contract_id` while reconstructing
  evidence. Automatic `mission_id` creation is allowed only for a new or
  pre-existing project without continuity files.
- Never infer completion from a plan, diff, or success statement alone.
- Never merge two missions because their titles look similar.
- Never run the next lot automatically.
- If evidence conflicts, stop at `continuity_blocked` and request human
  resolution.

## Output

The summary must include:

- mission and current lot;
- facts supported by evidence;
- unresolved contradictions and limitations;
- protected areas and stop conditions;
- the next permitted preparation step;
- actions that remain unauthorized.

The summary is a handoff aid, not a source of execution authority.

## Limits

- Do not repair contradictions, synthesize lot or contract identifiers, or
  infer progress.
- Do not run, approve, or advance the next lot.
- Treat `continuity_valid` as structural consistency, not project acceptance.

## Example invocation

`Use $resume-project-context to resume the current project automatically and render a handoff to ./handoff without starting the next lot.`
