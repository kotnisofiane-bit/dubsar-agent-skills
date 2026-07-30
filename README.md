# DUBSAR Agent Skills

[![validate](https://github.com/kotnisofiane-bit/dubsar-agent-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/kotnisofiane-bit/dubsar-agent-skills/actions/workflows/validate.yml)

![DUBSAR Agent Skills: lightweight local project-continuity and audit-readiness workflows](docs/assets/dubsar-agent-skills.png)

Portable, offline Agent Skills for automation audit preparation and
evidence-aware project continuity.

DUBSAR Agent Skills provides two small, inspectable packs for Claude Code,
Codex, Cursor, and Hermes Agent. The packs help an AI agent structure local
evidence and project context without connecting to production services,
granting itself authority, or presenting preparation work as an audit result.

## DUBSAR ecosystem

[Sofiane Kotni](https://dubsar.ai/sofiane-kotni/) created DUBSAR and these
public Agent Skills. Related public resources:

- [DUBSAR website](https://dubsar.ai/)
- [DUBSAR public documentation](https://github.com/kotnisofiane-bit/DUBSAR)
- [Sofiane Kotni on LinkedIn](https://www.linkedin.com/in/sofiane-kotni/)
- [*Digital Trust* — English edition](https://www.amazon.fr/dp/B0GZ4RH1KX)
- [*Digital Trust* — French edition](https://www.amazon.fr/dp/B0H739BFJP)
- [Sofiane Kotni's Amazon author page](https://www.amazon.fr/stores/Sofiane-KOTNI/author/B0H6NBHZTC)

The MIT license covers only this repository. These packs are a lightweight
public adaptation of the DUBSAR governance doctrine: portable instructions,
local contracts, and deterministic helpers. They are not the private DUBSAR
product, Core, or runtime and include no hooks, MCP server, Core connection,
enforcement runtime, or background orchestrator.

> **Status:** public beta v0.1.1. The local test suite covers public-boundary
> rules, deterministic outputs, synthetic end-to-end workflows, host manifest
> resolution, and common unsafe inputs. This is not a certification of the
> packs, an audited system, or any host product.

## Why use these skills?

The packs are useful when a team needs a repeatable, reviewable workflow rather
than another free-form agent conversation:

- prepare a bounded inventory of automations or AI agents before a human audit;
- identify actions that can communicate, move money, change access, alter data,
  or otherwise create a material effect;
- separate observations, reports, derivations, assumptions, and missing
  evidence;
- turn a broad project into explicit, independently verifiable lots;
- preserve mission, execution boundaries, evidence, and next steps across
  people, tools, and sessions;
- create deterministic local review bundles and handoff summaries.

These skills prepare information for human review. They do not run an audit,
decide compliance, certify safety, execute project work, deploy software, or
operate a production DUBSAR runtime.

## The two packs

| Pack | Purpose | Main local outputs |
| --- | --- | --- |
| [`dubsar-audit-readiness`](packages/dubsar-audit-readiness/README.md) | Scope an automation or AI-agent review, inventory the environment, map sensitive actions, expose evidence gaps, and export a deterministic bundle. | `audit-scope.json`, `automation-inventory.json`, `sensitive-actions.json`, `evidence-index.json`, `evidence-review.json` |
| [`dubsar-project-continuity`](packages/dubsar-project-continuity/README.md) | Keep a significant project bounded, evidence-aware, and safely resumable across interruptions and handoffs. | `mission.json`, `lots.json`, `execution-contract.json`, `evidence.json`, deterministic handoff |

Both packs use standard `SKILL.md` folders. Their executable helpers require
Node.js 20 or newer and use only Node.js built-ins.

### Continuity without session management

Identifiers are internal local keys, not user-facing session controls. The
helpers generate one `mission_id` per project mission and one `case_id` per
audit-preparation case, then store that identifier in every related local
file. Users do not need to choose, copy, or remember it.

Changing chat, agent host, or context window does not create a new identifier.
The helper searches upward only to the nearest Git project root and reuses the
nearest matching ancestor workspace. Without a Git root, the supplied start
directory is the project boundary. A pre-existing project without continuity
files may start a fresh local, non-canonical continuity record without
inventing earlier DUBSAR Core, session, execution, approval, or evidence
records.

Each directory scope has one active project workspace and one active audit
workspace. When the requested work is genuinely a different mission or case,
the skill asks for that material separation once, then creates an exact marker
inside a dedicated in-project directory. It never recycles an old identifier
or asks the user to invent the new one.

## All 12 skills

Each pack contains one end-to-end umbrella skill and five focused skills.

### Audit readiness

| Skill | Use it when |
| --- | --- |
| [`dubsar-audit-readiness`](packages/dubsar-audit-readiness/skills/dubsar-audit-readiness/SKILL.md) | You want the complete local audit-preparation workflow from scope through deterministic export. |
| [`frame-audit-scope`](packages/dubsar-audit-readiness/skills/frame-audit-scope/SKILL.md) | You need an explicit objective, permitted evidence, exclusions, time window, limits, and approval record. |
| [`inventory-automations`](packages/dubsar-audit-readiness/skills/inventory-automations/SKILL.md) | You need an evidence-backed inventory of automations, agents, triggers, systems, owners, and dependencies. |
| [`map-sensitive-actions`](packages/dubsar-audit-readiness/skills/map-sensitive-actions/SKILL.md) | You need to map material external effects and the human-review points around them. |
| [`review-evidence-gaps`](packages/dubsar-audit-readiness/skills/review-evidence-gaps/SKILL.md) | You need to distinguish supported observations from reports, contradictions, gaps, and assumptions. |
| [`export-audit-bundle`](packages/dubsar-audit-readiness/skills/export-audit-bundle/SKILL.md) | You have a validated workspace and need a deterministic, non-certifying bundle for human review. |

### Project continuity

| Skill | Use it when |
| --- | --- |
| [`dubsar-project-continuity`](packages/dubsar-project-continuity/skills/dubsar-project-continuity/SKILL.md) | You want the complete mission-to-handoff workflow or a single portable Hermes skill. |
| [`frame-project-mission`](packages/dubsar-project-continuity/skills/frame-project-mission/SKILL.md) | A significant project is broad, ambiguous, risky, or likely to span multiple sessions. |
| [`decompose-project-lots`](packages/dubsar-project-continuity/skills/decompose-project-lots/SKILL.md) | You need small, ordered, independently verifiable lots with dependencies and stop conditions. |
| [`draft-execution-contract`](packages/dubsar-project-continuity/skills/draft-execution-contract/SKILL.md) | You need to record the permitted actions, exclusions, proof, rollback expectations, and stop rules for one lot. |
| [`record-project-evidence`](packages/dubsar-project-continuity/skills/record-project-evidence/SKILL.md) | You need reproducible evidence without treating a plan, command, diff, or agent statement as a completed outcome. |
| [`resume-project-context`](packages/dubsar-project-continuity/skills/resume-project-context/SKILL.md) | Work was interrupted or handed off and the current state must be reconstructed without inventing progress. |

## Quick start

Clone the repository and run its dependency-free checks:

```bash
git clone https://github.com/kotnisofiane-bit/dubsar-agent-skills.git
cd dubsar-agent-skills
npm test
npm run demo
```

`npm run demo` validates the synthetic examples without writing to them or
contacting a service. A successful run reports audit material as
`ready_for_human_review` and project material as `continuity_valid`; neither
status is an audit verdict or permission to execute work.

To try the local helpers directly:

```bash
node packages/dubsar-audit-readiness/scripts/ensure-audit-workspace.mjs --start .
node packages/dubsar-audit-readiness/scripts/validate-audit-workspace.mjs --root ./.dubsar-audit

node packages/dubsar-project-continuity/scripts/ensure-project-workspace.mjs --start .
node packages/dubsar-project-continuity/scripts/validate-project-workspace.mjs --root ./.dubsar-project
```

The `ensure-*` commands are the normal entry points: they reuse the nearest
ancestor marker or create one at the current Git project root. An optional
`--workspace` override must still be the exact marker name and remain inside
that project. The returned `workspace` is relative to the supplied `--start`;
an agent host resolves it locally before invoking a later helper, without
printing an absolute path. The lower-level `init-*` helpers remain available
for controlled explicit initialization. All helpers refuse unsafe traversal,
links, partial workspaces, identity conflicts, and destructive overwrites.

## Install in an agent host

The repository includes thin host manifests around the same portable skill
sources:

- **Claude Code:** add the GitHub repository as a plugin marketplace, then
  install either pack.
- **Codex:** clone the repository, add its local marketplace, and install a pack
  from the plugin browser.
- **Cursor:** import or copy each package as a local plugin.
- **Hermes Agent:** add the repository as a skill tap and install either
  self-contained umbrella skill.

See [HOSTS.md](HOSTS.md) for exact commands, local-development alternatives,
and host-specific caveats.

After installation, ask for an outcome in plain language, for example:

```text
Use dubsar-audit-readiness to frame a bounded review of the automation
evidence I provide. Do not inspect anything outside the approved scope.
```

```text
Use dubsar-project-continuity to turn this project into an approved mission,
verifiable lots, and a resumable local handoff. Do not execute a lot.
```

## Safety model

The public boundary is intentionally narrow:

- no account, secret, production connector, MCP server, hook, or background
  process is required;
- runtime helpers do not read environment variables or access the network;
- mission and case identifiers are generated once, stored locally, and reused
  across conversations and context compression;
- paths are explicit, traversal and symbolic links are rejected, and
  non-empty output directories are not overwritten;
- JSON is stable UTF-8 with sorted keys, relative paths, and SHA-256
  inventories where applicable;
- evidence language preserves `observed`, `reported`, `derived`, and
  `unverified` distinctions;
- human confirmation remains focused on material scope, evidence, export, and
  execution-boundary decisions; routine resume and context compression require
  no new approval;
- readiness, continuity, and integrity statuses describe local artifacts, not
  legal compliance, system safety, business approval, or execution authority.

Read [PUBLIC_BOUNDARY.md](PUBLIC_BOUNDARY.md) before adapting a pack to a new
domain.

## Validation and release status

Public beta validation includes:

- public-boundary scans for both packages;
- GitHub Actions on Windows and Linux with Node.js 20 and 22;
- synthetic CLI and end-to-end workflows;
- deterministic audit export and project handoff checks;
- credential, path traversal, link escape, contradiction, and unsafe-markup
  cases;
- resolution checks for Claude Code, Codex, and Cursor manifests;
- a fresh Claude Code profile installation of both packs from the public
  marketplace, exposing six skills per pack.

Run `npm test` on the exact commit you intend to use. Host marketplace
validation, fresh-profile installation, cross-platform checks, provenance
review, and the remaining release gates are tracked in
[RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md). Passing development tests is
necessary but does not make the packs certified, production-approved, or a
substitute for human review.

## Repository layout

```text
.
├── .agents/plugins/                 # Codex local marketplace
├── .claude-plugin/                  # Claude Code marketplace
├── .cursor-plugin/                  # Cursor marketplace metadata
├── packages/
│   ├── dubsar-audit-readiness/
│   └── dubsar-project-continuity/
├── skills/                          # Hermes-compatible umbrella skill view
├── examples/                        # synthetic, non-production fixtures
├── tests/                           # safety, packaging, determinism, and E2E tests
└── tools/                           # repository checks and demo runner
```

## Limits and non-affiliation

This repository is a clean-room, public preparation layer. It contains no
production DUBSAR implementation, private protocol, deployment topology,
activation or billing path, enforcement runtime, or automatic permission
grant.

Claude Code is a product of Anthropic; Codex is a product of OpenAI; Cursor is
a product of Cursor; Hermes Agent is a product of Nous Research. DUBSAR Agent
Skills is independent and is not affiliated with, endorsed by, or sponsored by
those companies. Product names and trademarks belong to their respective
owners.

Contributions are welcome under the constraints in
[CONTRIBUTING.md](CONTRIBUTING.md). The repository is available under the
[MIT License](LICENSE).
