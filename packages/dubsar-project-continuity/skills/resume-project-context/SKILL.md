---
name: resume-project-context
description: Reconstruct the current state of a project from its portable mission, lots, execution contract, and evidence files without inventing progress. Use when asked to resume, hand off, recover, or verify project state after interruption, tool change, or uncertainty about completion.
---

# Resume Project Context

## Objective

Recover a safe starting point from recorded facts rather than conversational
memory.

## Inputs

- an explicit local workspace path containing `mission.json`, `lots.json`,
  `execution-contract.json`, and `evidence.json`;
- an explicit output path when a rendered handoff is requested.

## Workflow

1. When the complete pack is installed, run
   `../dubsar-project-continuity/scripts/validate-project-workspace.mjs --root <workspace>`;
   otherwise inspect the four input files manually.
2. Read `mission.json`, `lots.json`, `execution-contract.json`, and
   `evidence.json`.
3. Confirm that mission, lot, and contract identifiers agree.
4. Identify the last lot whose required evidence is actually present.
5. Separate completed, partial, planned, blocked, and unknown work.
6. Surface contradictions and do not resolve them by inference.
7. Name the next preparation step and the authority still required.
8. When the helper is available, render a stable handoff with
   `../dubsar-project-continuity/scripts/render-project-summary.mjs --root <workspace> --output <target>`.

## Resume rules

- Never create a missing execution identifier.
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

- Do not repair contradictions, create missing identifiers, or infer progress.
- Do not run, approve, or advance the next lot.
- Treat `continuity_valid` as structural consistency, not project acceptance.

## Example invocation

`Use $resume-project-context to validate ./.dubsar-project and render a handoff to ./handoff without starting the next lot.`
