---
name: frame-project-mission
description: Turn a significant project request into a bounded mission with purpose, scope, exclusions, acceptance evidence, risks, and stop conditions. Use when asked to frame, charter, scope, or clarify a broad or ambiguous project before planning or change begins.
---

# Frame Project Mission

## Objective

Preserve the user's intent in a reviewable mission before decomposing or
executing work.

## Inputs

- the desired outcome and why it matters;
- known users, repositories, systems, documents, and constraints;
- acceptance signals, risks, exclusions, and unresolved decisions.

## Workflow

1. State the desired outcome in plain language.
2. Record why the outcome matters and who will use it.
3. Separate in-scope work from explicit exclusions.
4. Capture known repositories, systems, documents, and constraints without
   assuming ownership or authority.
5. Define observable acceptance evidence.
6. Record risks, unresolved decisions, and conditions that require stopping.
7. Ask the user to approve the mission before treating it as active.

## Output

Write `mission.json`:

```json
{
  "format": "dubsar.project-mission/1",
  "mission_id": "local-stable-id",
  "title": "short title",
  "desired_outcome": "plain-language outcome",
  "purpose": "why it matters",
  "in_scope": [],
  "excluded": [],
  "known_inputs": [],
  "constraints": [],
  "acceptance_evidence": [],
  "risks": [],
  "open_decisions": [],
  "stop_conditions": [],
  "status": "draft"
}
```

When installed with the complete pack, use
`../dubsar-project-continuity/scripts/init-project-workspace.mjs` with an
explicit `--output` directory. Otherwise create the documented JSON manually.

## Limits

- Keep unknowns in `open_decisions`; do not invent scope, ownership, or proof.
- Keep `status` as `draft` until the user approves the mission.
- Mission approval does not authorize external writes, deployments, merges, or
  messages.

## Example invocation

`Use $frame-project-mission to turn this broad project request into a bounded mission with observable acceptance evidence.`
