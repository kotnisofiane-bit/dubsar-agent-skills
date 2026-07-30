# DUBSAR Project Continuity

Portable Agent Skills that keep a long-running project understandable,
verifiable, and safely resumable across people, tools, and sessions.

## Skills

| Skill | Use it to |
| --- | --- |
| `$frame-project-mission` | Turn broad intent into an approved, bounded mission |
| `$decompose-project-lots` | Split an approved mission into ordered, verifiable lots |
| `$draft-execution-contract` | Bound one candidate lot before implementation |
| `$record-project-evidence` | Append claims, proof, validation, and limitations |
| `$resume-project-context` | Reconstruct state after interruption or handoff |
| `$dubsar-project-continuity` | Run the complete continuity workflow |

## Workflow

1. turns an idea into a bounded mission with explicit proof;
2. decomposes the mission into small, ordered lots;
3. records an execution contract before work begins;
4. indexes evidence without converting claims into facts;
5. produces a deterministic handoff and resume summary.

Use the specialized skill for one step and the umbrella skill only for the
complete sequence.

## Boundaries

It does not grant execution authority, run background actions, synchronize
repositories, merge branches, deploy software, or communicate with a production
DUBSAR service. It declares no hooks or MCP dependencies, and its scripts make
no network calls.

## Hosts

The same `skills/` directory is used by:

- Codex through `.codex-plugin/plugin.json`;
- Claude Code through `.claude-plugin/plugin.json`;
- Cursor through `.cursor-plugin/plugin.json`;
- Hermes Agent through the self-contained umbrella skill mirrored under the
  repository root `skills/` directory.

## Local scripts

```bash
node scripts/init-project-workspace.mjs --output ./.dubsar-project
node scripts/validate-project-workspace.mjs --root ./.dubsar-project
node scripts/render-project-summary.mjs --root ./.dubsar-project --output ./handoff
```

All scripts are offline and dependency-free. They never run project commands.
Pass explicit input and output paths.

## Status

Public beta v0.1.0 under the MIT License. The package includes reviewed
clean-room provenance and a deterministic release inventory. See the
repository-level `PUBLIC_BOUNDARY.md`.
