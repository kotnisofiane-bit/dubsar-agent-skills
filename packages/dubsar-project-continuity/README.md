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

## Lightweight continuity

The initializer generates one opaque local `mission_id` automatically. The
same mission keeps that identifier across conversations, context compression,
host changes, interruptions, and handoffs. Users do not need to choose or
remember it.

On resume, the helper searches from the current directory to the nearest Git
project root and reuses the nearest ancestor `.dubsar-project`. Without a Git
root, the supplied start directory is the boundary. Initialize a new workspace
only when no mission workspace exists. For a pre-existing project, start a
fresh local non-canonical record and preserve uncertain history as reported or
unverified.

One directory scope has one active mission workspace. If the request is a
genuinely different mission, confirm that separation before reuse, then create
an exact `.dubsar-project` marker inside a dedicated in-project directory. Do
not delete, overwrite, or recycle the previous mission identifier.

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
no network calls. This pack contains doctrine and local helpers only, not the
DUBSAR Core, product runtime, or canonical session records.

## Hosts

The same `skills/` directory is used by:

- Codex through `.codex-plugin/plugin.json`;
- Claude Code through `.claude-plugin/plugin.json`;
- Cursor through `.cursor-plugin/plugin.json`;
- Hermes Agent through the self-contained umbrella skill mirrored under the
  repository root `skills/` directory.

## Local scripts

From the target project's root, point to the installed pack:

```bash
node /absolute/path/to/dubsar-project-continuity/scripts/ensure-project-workspace.mjs --start .
node /absolute/path/to/dubsar-project-continuity/scripts/validate-project-workspace.mjs --root ./.dubsar-project
node /absolute/path/to/dubsar-project-continuity/scripts/render-project-summary.mjs --root ./.dubsar-project --output ./handoff
```

All scripts are offline and dependency-free. They never run project commands.
The `ensure` helper resolves or initializes the workspace automatically and
returns only an opaque identifier and a path relative to the supplied
`--start`. The host resolves that path locally before invoking another helper;
it does not need to expose an absolute path. The lower-level `init` helper
remains available for controlled explicit initialization.

## Status

Public beta v0.1.1 under the MIT License. The package includes reviewed
clean-room provenance and a deterministic release inventory. See the
repository-level `PUBLIC_BOUNDARY.md`.
