# Audit-readiness data contracts

Every document for one bounded audit-preparation case shares one automatically
generated, non-secret local `case_id`. It belongs to the case, not to a chat,
host session, or context window. Reuse it until the case is deliberately
closed or split. Users do not need to choose or remember it. An explicit
override remains available for controlled tooling and tests.

One directory scope has one active audit workspace. A materially different
case requires an explicit human separation decision before reuse. Create its
exact `.dubsar-audit` marker inside a dedicated in-project directory and let
the helper generate the new ID; never delete, overwrite, or recycle the
previous case ID.

## Required files

| File | Format | Purpose |
| --- | --- | --- |
| `audit-scope.json` | `dubsar.audit-scope/1` | Objective, boundaries, evidence permission, limitations |
| `automation-inventory.json` | `dubsar.automation-inventory/1` | Observed, reported, or unknown automation records |
| `sensitive-actions.json` | `dubsar.sensitive-actions/1` | Material effects and proposed review points |
| `evidence-index.json` | `dubsar.evidence-index/1` | Relative evidence paths and SHA-256 digests |
| `evidence-review.json` | `dubsar.evidence-review/1` | Gaps, contradictions, limitations, preparation state |

An approved scope includes an `approval` object with `approved_by`,
`approved_at`, `approval_ref`, and `source: "user-provided"`. Use a role or
pseudonymous identifier when personal attribution is unnecessary.

Every `approved_evidence` ID must resolve in `evidence-index.json`, and every
indexed artifact must be explicitly approved. The sensitive-action map uses a
top-level `review_status`; an empty map is not considered reviewed implicitly.
`automation-inventory.json.generated_from` contains at least one indexed
artifact, and every inventory item cites at least one indexed artifact through
`evidence_refs`.

Every entry in `evidence-review.json.supported_observations` is an object with
a non-empty `statement` and at least one `evidence_refs` entry resolving to an
indexed artifact:

```json
{
  "statement": "The exported workflow declares one external message action.",
  "evidence_refs": ["artifact-workflow-export"]
}
```

Keep unsupported claims under `reported_statements` or `missing_evidence`.

## Evidence index

Each artifact has:

```json
{
  "artifact_id": "local-stable-id",
  "path": "evidence/relative-file.json",
  "sha256": "64 lowercase hexadecimal characters"
}
```

Paths must be relative, remain inside the workspace, and resolve to regular
files rather than symbolic links.

## Preparation states

- `not_ready`: the default; used when scope approval, required evidence, or
  consistency is missing.
- `ready_for_human_review`: permitted only after structural validation and
  explicit scope approval.

Neither state is a compliance or audit verdict.
