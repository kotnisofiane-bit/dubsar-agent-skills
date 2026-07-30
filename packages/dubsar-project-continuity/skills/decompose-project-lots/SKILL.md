---
name: decompose-project-lots
description: Split an approved mission into small, ordered, independently verifiable lots with dependencies, exclusions, proof, and stop conditions. Use when asked to break down, phase, sequence, or audit a project that is too large for one safe execution pass.
---

# Decompose Project Lots

## Objective

Create the smallest ordered sequence that still produces meaningful,
human-reviewable progress.

## Inputs

- an approved `mission.json`;
- known dependencies, protected areas, and irreversible boundaries;
- existing evidence identifiers, if any.

## Lot design rules

Each lot must:

- have one primary outcome;
- name the files, systems, or artifacts it may touch when known;
- list dependencies and required prior evidence;
- define what it will not do;
- specify a proportional validation method;
- end at a human-reviewable boundary;
- avoid bundling cleanup, feature work, deployment, and migration together.

## Workflow

1. Read the approved `mission.json`.
2. Identify dependency order and irreversible boundaries.
3. Prefer discovery or preservation lots before mutation lots.
4. Give each lot a stable ID and one sentence outcome.
5. Record expected evidence and stop conditions.
6. Mark only the first unblocked lot as `candidate`; leave all others `planned`.

## Output

Write `lots.json`:

```json
{
  "format": "dubsar.project-lots/1",
  "mission_id": "same-as-mission",
  "lots": [
    {
      "lot_id": "local-stable-id",
      "title": "bounded outcome",
      "depends_on": [],
      "in_scope": [],
      "excluded": [],
      "expected_evidence": [],
      "validation": [],
      "stop_conditions": [],
      "status": "planned|candidate|complete"
    }
  ]
}
```

## Limits

- Do not alter the approved mission or execute any lot.
- Keep at most one lot in `candidate` state.
- Never mark a lot complete from an intention, plan, or agent statement alone;
  completion requires its declared `observed` or `derived` evidence.

## Example invocation

`Use $decompose-project-lots to split this approved mission into ordered lots with explicit proof and stop conditions.`
