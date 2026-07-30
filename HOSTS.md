# Install DUBSAR Agent Skills

DUBSAR Agent Skills uses the same `SKILL.md` sources in Claude Code, Codex,
Cursor, and Hermes Agent. Host manifests expose those sources; they do not add
network access, hooks, credentials, production connectors, or execution
authority.

Review the source before installing it. Plugin and skill installation gives an
agent host access to local instructions and helper scripts under that host's
normal sandbox and approval policy.

## Compatibility at a glance

| Host | Repository entry point | Installation surface | Skills exposed |
| --- | --- | --- | --- |
| Claude Code | `.claude-plugin/marketplace.json` and each package's `.claude-plugin/plugin.json` | GitHub or local plugin marketplace | All six skills in the selected pack |
| Codex | `.agents/plugins/marketplace.json` and each package's `.codex-plugin/plugin.json` | Local marketplace after clone | All six skills in the selected pack |
| Cursor | Each package's `.cursor-plugin/plugin.json` | Manual local plugin import | All six skills in the selected pack |
| Hermes Agent | Root `skills/` tap view | GitHub skill tap | One self-contained umbrella skill per pack |

The Hermes view intentionally publishes the two umbrella workflows. Claude
Code, Codex, and Cursor expose the umbrella plus the five focused skills in
each installed pack.

## Prerequisites

- Node.js 20 or newer is required only when a workflow runs the bundled local
  helpers.
- No third-party npm runtime dependencies are required.
- Installing from GitHub requires network access; the installed runtime
  workflows themselves are offline.

Before host installation, a local review is recommended:

```bash
git clone https://github.com/kotnisofiane-bit/dubsar-agent-skills.git
cd dubsar-agent-skills
npm test
```

## Claude Code

Add the repository marketplace, then install one or both packs:

```text
/plugin marketplace add kotnisofiane-bit/dubsar-agent-skills
/plugin install dubsar-audit-readiness@dubsar-agent-skills
/plugin install dubsar-project-continuity@dubsar-agent-skills
/reload-plugins
```

For an offline or unpublished checkout, replace the GitHub identifier in the
first command with the absolute path to the cloned repository. The marketplace
name remains `dubsar-agent-skills`.

Claude Code supports user, project, and local installation scopes. Use the
interactive `/plugin` browser when you need to choose a non-default scope.
This repository intentionally defines no Claude Code hooks.

Host reference:
[Claude Code plugin marketplaces](https://code.claude.com/docs/en/discover-plugins).

## Codex

Clone the repository first, then add its root as a local marketplace:

```bash
codex plugin marketplace add /absolute/path/to/dubsar-agent-skills
codex
```

Inside Codex, open `/plugins`, select **DUBSAR Agent Skills**, inspect a pack,
and install it. Start a new Codex session after installation so the six bundled
skills are discovered.

When working directly inside the clone, Codex can also discover the
repo-scoped `.agents/plugins/marketplace.json`. The explicit marketplace
command is preferable when you want the packs available outside this
repository.

The marketplace contains local relative paths, so add the repository root, not
the JSON file or an individual package directory.

Host references:
[Codex local marketplaces](https://developers.openai.com/plugins/build/plugins)
and [Codex plugins](https://developers.openai.com/codex/plugins).

## Cursor

Until the repository has completed fresh-profile marketplace validation, use
Cursor's local plugin path rather than relying on an unverified install
command. Copy each complete package you want to use; do not copy only its
`skills/` directory.

On macOS, Linux, or WSL:

```bash
mkdir -p ~/.cursor/plugins/local
cp -R packages/dubsar-audit-readiness ~/.cursor/plugins/local/
cp -R packages/dubsar-project-continuity ~/.cursor/plugins/local/
```

On Windows PowerShell:

```powershell
$cursorPlugins = Join-Path $HOME ".cursor\plugins\local"
New-Item -ItemType Directory -Force $cursorPlugins | Out-Null
Copy-Item -Recurse ".\packages\dubsar-audit-readiness" $cursorPlugins
Copy-Item -Recurse ".\packages\dubsar-project-continuity" $cursorPlugins
```

If a destination already exists, review and remove or rename the old local copy
before installing an update; do not merge versions blindly. Restart Cursor or
run **Developer: Reload Window**, then inspect the installed plugins before
using them. Enterprise workspaces may require an administrator to allow local
plugin imports.

Host reference: [Cursor plugins](https://cursor.com/docs/plugins).

## Hermes Agent

The repository root includes a tap-compatible `skills/` view containing the
two self-contained umbrella skills. Add the tap, inspect the skills, and
install either workflow:

```bash
hermes skills tap add kotnisofiane-bit/dubsar-agent-skills
hermes skills inspect kotnisofiane-bit/dubsar-agent-skills/dubsar-audit-readiness
hermes skills install kotnisofiane-bit/dubsar-agent-skills/dubsar-audit-readiness
```

Or install project continuity:

```bash
hermes skills inspect kotnisofiane-bit/dubsar-agent-skills/dubsar-project-continuity
hermes skills install kotnisofiane-bit/dubsar-agent-skills/dubsar-project-continuity
```

Hermes treats third-party taps as community sources and runs its own security
scan. Review any finding rather than bypassing it automatically. Installed
skills appear under `~/.hermes/skills/` and can be invoked as
`/dubsar-audit-readiness` or `/dubsar-project-continuity`.

Host reference:
[Hermes Agent skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills).

## What installation does not do

Installing a pack does not:

- connect an account or production system;
- start a daemon, hook, scheduled job, or background process;
- read credentials or environment variables;
- grant the agent permission to inspect evidence, execute project work, export
  data, or communicate externally;
- establish legal compliance, audit completion, safety, or certification.

The agent still needs explicit input paths, approved evidence, and human
confirmation at the boundaries documented by each skill.

## Current validation boundary

Repository tests verify that host manifests resolve to the intended local
packages and portable skills. For v0.1.0, both packs were also installed from
the public marketplace in a fresh Claude Code profile, and the test suite
passed on Windows and Linux with Node.js 20 and 22. This does not prove that
every current host build, operating system, enterprise policy, or marketplace
UI will install the packs. Release evidence remains tracked in
[RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

If a host changes its plugin format or installation flow, prefer that host's
official documentation and open an issue or pull request with the exact host
version and observed error.

## Non-affiliation

Claude Code, Codex, Cursor, and Hermes Agent are third-party hosts. Their
inclusion here describes format compatibility only; it does not imply
affiliation, endorsement, sponsorship, or certification by Anthropic, OpenAI,
Cursor, or Nous Research.
