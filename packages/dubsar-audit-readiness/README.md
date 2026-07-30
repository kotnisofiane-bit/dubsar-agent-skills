# DUBSAR Audit Readiness

Portable Agent Skills for preparing a bounded automation or AI-agent audit
from user-approved local evidence.

## Skills

| Skill | Use |
| --- | --- |
| `$dubsar-audit-readiness` | Run the complete preparation workflow |
| `$frame-audit-scope` | Define the objective, evidence, exclusions, and limits |
| `$inventory-automations` | Build an evidence-linked automation inventory |
| `$map-sensitive-actions` | Map material effects and human review points |
| `$review-evidence-gaps` | Separate support, contradictions, gaps, and limits |
| `$export-audit-bundle` | Export a validated deterministic review bundle |

The workflow produces five case-linked JSON documents and can package them with
approved evidence for human review. It does not produce an audit verdict.

## Local helpers

From this package directory:

```bash
node scripts/init-audit-workspace.mjs --output ./audit-case
node scripts/validate-audit-workspace.mjs --root ./audit-case
node scripts/export-audit-bundle.mjs --root ./audit-case --output ./audit-bundle
```

Pass explicit paths. The scripts use Node.js built-ins only, perform no network
calls, and refuse unsafe paths or destructive overwrites.

## Boundaries

The pack does not connect to production services, request credentials, run or
modify an automation, decide legal compliance, certify a system, upload a
bundle, or communicate with a production DUBSAR service. It includes no hooks,
MCP server, network integration, or DUBSAR Core dependency.

## Hosts

The same `skills/` directory is used by Codex, Claude Code, Cursor, and
other Agent Skills hosts through their repository-level manifests. Hermes uses
the self-contained umbrella skill mirrored under the repository root
`skills/` directory.

## Status

Public beta v0.1.0 under the MIT License. The package includes reviewed
clean-room provenance and a deterministic release inventory. See the
repository-level `PUBLIC_BOUNDARY.md`.
