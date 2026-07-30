# Synthetic examples

These examples demonstrate the two DUBSAR Agent Skills packs with local,
synthetic data. They contain no production credentials, external customer
identifiers, real audit conclusion, or authority to execute project work.

## Run both examples

From the repository root:

```bash
npm run demo
```

The demo reads and validates the fixtures without modifying them or contacting
any service. Expected high-level results:

- audit readiness: structurally valid and `ready_for_human_review`, with the
  explicit disclaimer that no audit result or certification was produced;
- project continuity: `continuity_valid`, with a next preparation step and the
  explicit disclaimer that no project action was executed or authorized.

Exact counts and digests are derived from the checked-out fixtures. Do not copy
expected hashes into external workflows.

## Audit-readiness fixture

[`audit-readiness/`](audit-readiness/) models one bounded automation review:

| File | Purpose |
| --- | --- |
| `audit-scope.json` | Defines the business question, inclusions, exclusions, evidence boundary, limits, and approval record. |
| `automation-inventory.json` | Records the single synthetic automation and only the relationships supported by approved evidence. |
| `sensitive-actions.json` | Maps the synthetic material action and its human-review requirement. |
| `evidence-index.json` | Indexes approved local evidence and its integrity metadata. |
| `evidence-review.json` | Separates supported observations from gaps, contradictions, assumptions, and limitations. |
| `evidence/workflow.json` | Provides the approved synthetic artifact referenced by the inventory and review. |

The fixture is ready for human review because its required local structure and
evidence relationships are present. It does not say that an automation is
compliant, safe, approved, or certified.

## Project-continuity fixture

[`project-continuity/`](project-continuity/) models a bounded project handoff:

| File | Purpose |
| --- | --- |
| `mission.json` | Defines the synthetic outcome, scope, exclusions, acceptance evidence, risks, and stop conditions. |
| `lots.json` | Contains one candidate lot with dependencies and proof requirements. |
| `execution-contract.json` | Records the preparation and execution boundary for that lot. |
| `evidence.json` | Contains one typed evidence entry without claiming that the lot is complete. |

The fixture demonstrates continuity across an interruption. It does not start
the candidate lot, grant authority, merge code, deploy software, or prove an
end-user outcome.

## Adapt an example safely

Copy a fixture to a separate working directory before editing it:

```bash
cp -R examples/audit-readiness ./my-audit-case
cp -R examples/project-continuity ./my-project-context
```

On Windows PowerShell:

```powershell
Copy-Item -Recurse ".\examples\audit-readiness" ".\my-audit-case"
Copy-Item -Recurse ".\examples\project-continuity" ".\my-project-context"
```

Then replace synthetic values only with data you are authorized to handle.
Keep secrets and credentials out of the workspace, retain the evidence status
distinctions, and validate through the package helpers before exporting or
rendering a handoff.

The examples are documentation and regression fixtures, not templates for
legal conclusions or production access.
