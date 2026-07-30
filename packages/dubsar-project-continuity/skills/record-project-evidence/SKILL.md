---
name: record-project-evidence
description: Append project claims with reproducible local evidence, artifact references, validation results, and limitations. Use when asked to capture proof, preserve an audit trail, or verify a lot during or after work without conflating plans, commands, and observed outcomes.
---

# Record Project Evidence

## Objective

Maintain an append-only evidence index that distinguishes supported facts from
reported or unverified claims.

## Inputs

- the shared `mission_id` and an existing `lot_id`;
- one bounded claim;
- inspected artifact paths, validation method and result, relevant exit status,
  limitations, and failed checks.

## Evidence classes

- `observed`: directly inspected output or artifact;
- `reported`: a statement supplied by a person or another tool;
- `derived`: a deterministic calculation from cited inputs;
- `unverified`: a claim that still needs proof.

An executed command is not proof of success unless its result and relevant exit
status were observed. A unit test does not prove an end-user workflow unless it
actually exercises that workflow.

## Workflow

1. Record the claim in plain language.
2. Assign the correct evidence class.
3. Cite relative artifact paths or a concise observation reference.
4. Record the validation method and result separately.
5. Add limitations and failed checks.
6. Append a new entry; do not silently replace an earlier one.

## Output

Append to `evidence.json`:

```json
{
  "format": "dubsar.project-evidence/1",
  "mission_id": "same-as-mission",
  "entries": [
    {
      "evidence_id": "local-stable-id",
      "lot_id": "related-lot",
      "claim": "one bounded claim",
      "class": "observed",
      "artifact_refs": ["relative/path/to/artifact"],
      "validation": ["method and observed result"],
      "limitations": []
    }
  ]
}
```

## Limits

- Append a new entry; do not rewrite earlier observations or their provenance.
- An `observed` or `derived` entry requires at least one `artifact_refs` value
  and one reproducible `validation` value.
- `reported` and `unverified` claims cannot support a completed lot.
- Sort only for deterministic rendering; preserve the original entries.

## Example invocation

`Use $record-project-evidence to append the observed validation result for this lot, including artifact paths and limitations.`
