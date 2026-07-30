# Project-continuity data contracts

Every document uses the same non-secret local `mission_id`.

## Required files

| File | Format | Purpose |
| --- | --- | --- |
| `mission.json` | `dubsar.project-mission/1` | Outcome, boundaries, evidence, risks, stop conditions |
| `lots.json` | `dubsar.project-lots/1` | Ordered, independently verifiable work units |
| `execution-contract.json` | `dubsar.execution-contract/1` | Exact boundary for one candidate lot |
| `evidence.json` | `dubsar.project-evidence/1` | Append-only evidence entries and limitations |

## Evidence classes

- `observed`: directly inspected output or artifact;
- `reported`: a statement from a person or another tool;
- `derived`: a deterministic calculation from cited inputs;
- `unverified`: a claim that still needs proof.

An `observed` or `derived` entry has at least one `artifact_refs` value and at
least one reproducible `validation` entry. Without both, it cannot support a
completed lot.

## Continuity states

- `continuity_valid`: identifiers and declared references are structurally
  consistent.
- `continuity_blocked`: the recorded state contains contradictions or missing
  references that require human resolution.

`continuity_valid` does not mean that project acceptance is complete and grants
no permission to execute work.
