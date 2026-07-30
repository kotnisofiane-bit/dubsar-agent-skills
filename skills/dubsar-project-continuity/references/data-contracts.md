# Project-continuity data contracts

Every document for one mission shares one automatically generated, non-secret
local `mission_id`. It belongs to the mission, not to a chat, host session, or
context window. Reuse it across context compression, new conversations, agent
hosts, interruptions, and handoffs. Generate another only for a genuinely new
mission. An explicit override remains available for controlled tooling and
tests.

A local `mission_id` is not a DUBSAR Core `session_id` or `execution_id` and
creates no canonical runtime record.

One directory scope has one active mission workspace. A materially different
mission requires an explicit human separation decision before reuse. Create
its exact `.dubsar-project` marker inside a dedicated in-project directory and
let the helper generate the new ID; never delete, overwrite, or recycle the
previous mission ID.

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
