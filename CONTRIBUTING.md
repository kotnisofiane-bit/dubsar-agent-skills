# Contributing to DUBSAR Agent Skills

Contributions should keep both packs portable, offline, evidence-aware, and
independently reviewable. A smaller change with explicit proof is preferable to
a broad change that weakens the public boundary.

## Before you start

1. Read [PUBLIC_BOUNDARY.md](PUBLIC_BOUNDARY.md).
2. Identify the exact pack and skill affected.
3. Check existing issues and pull requests for overlapping work.
4. Use only public sources and clean-room original implementation.
5. Decide how the change will be exercised with synthetic data.

Do not copy code, prompts, documentation, identifiers, routes, protocols, or
examples from a private or non-public DUBSAR source.

## Repository model

The canonical pack sources live under:

```text
packages/dubsar-audit-readiness/
packages/dubsar-project-continuity/
```

Each pack contains six skills: one umbrella workflow and five focused
workflows. Host manifests must remain thin views over the same `skills/`
directory.

The root `skills/` directory is the Hermes tap view of the two self-contained
umbrella skills. Treat the package copies as canonical. Every change to an
umbrella skill or one of its bundled `agents/`, `references/`, or `scripts/`
files must be replicated byte-for-byte in the matching root `skills/`
directory. The packaging test intentionally fails when either copy drifts; do
not edit only the tap view.

## Accepted contribution scope

Good contributions include:

- clearer boundaries, inputs, outputs, stop conditions, or evidence language;
- deterministic local validation or rendering behavior;
- synthetic fixtures for a realistic failure mode;
- safer path, credential, provenance, or output handling;
- compatibility fixes that preserve a single portable skill source;
- concise documentation that accurately reflects tested behavior.

Out of scope:

- production connectors, credentials, account activation, or billing;
- network access from a runtime helper;
- hooks, daemons, scheduled jobs, or background execution;
- automatic permission grants or runtime interception;
- deployment, merge, messaging, or other production side effects;
- internal DUBSAR implementation details;
- claims of compliance, certification, safety approval, completed audit, or
  execution authority;
- third-party runtime dependencies without prior maintainer agreement.

## Change a skill

Keep each skill in a standard `skills/<name>/SKILL.md` directory.

- Preserve lowercase kebab-case names.
- Put trigger conditions and exclusions in the frontmatter description.
- Make required inputs, outputs, approvals, and stop conditions explicit.
- Prefer a focused skill for one step and the umbrella skill for the complete
  workflow.
- Keep supporting scripts and references inside the pack or self-contained
  umbrella skill as required by the supported hosts.
- Never turn a missing fact into an observation or infer completion from a
  plan, command, diff, or agent statement.

If the change adds behavior, add a synthetic test that exercises both the
success path and the relevant refusal or failure path.

## Evidence and status language

Use these terms precisely:

- `observed`: supported by an identified local artifact and an applicable
  validation step;
- `reported`: supplied by a person or source but not independently observed;
- `derived`: calculated from identified evidence with the method recorded;
- `unverified`: not yet supported by sufficient evidence.

`ready_for_human_review` describes an audit-preparation workspace.
`continuity_valid` describes internally consistent project-continuity
artifacts. Neither term is a verdict about the underlying system or permission
to act.

## Documentation standards

Write for a technical reader who may not know DUBSAR.

- Lead with the practical outcome and boundaries.
- Use concrete terms such as “automation audit preparation,” “AI agent
  evidence,” and “project continuity” where they naturally describe the
  content; do not repeat keywords for search ranking.
- Link to the canonical skill or contract instead of duplicating long
  instructions.
- Distinguish implemented, tested, planned, and unsupported behavior.
- Do not claim a host installation path has been validated unless it was tested
  from a fresh profile on the stated host version.
- Preserve the non-affiliation language for Claude Code, Codex, Cursor, and
  Hermes Agent.

## Run the checks

Node.js 20 or newer is required. The repository has no third-party runtime
dependencies.

```bash
npm test
npm run demo
```

Before a release candidate, maintainers should also run:

```bash
npm run check:release
```

Do not weaken a boundary check merely to make a new fixture pass. Fix the
behavior or document why the proposed feature is outside this repository.

When a platform permits it, exercise the symbolic-link cases as well as the
normal test suite. Run release checks on Windows and Linux before marking the
cross-platform gate complete.

## Pull request checklist

- [ ] The change is confined to the public, offline preparation layer.
- [ ] No secret, credential, production identifier, or private implementation
      detail is included.
- [ ] New behavior has synthetic tests.
- [ ] Deterministic outputs remain byte-identical for identical inputs.
- [ ] Refusal paths do not echo sensitive input.
- [ ] Host manifests still point to the same canonical skills.
- [ ] The Hermes root view, when affected, matches its canonical umbrella
      skills.
- [ ] `npm test` and `npm run demo` pass on the submitted commit.
- [ ] Documentation states limits and validation scope without certification
      language.
- [ ] No unrelated generated files or local output directories are committed.

Include the exact commands run, operating system, Node.js version, pass/skip
counts, and any limitation in the pull request description.

## Security reports

Do not place exploit details, credentials, sensitive paths, or production data
in a public issue. Follow [SECURITY.md](SECURITY.md) and use GitHub private
vulnerability reporting. A security report should identify the affected
version, minimal reproduction, impact, and whether the issue can cross the
documented local public boundary.

## Review expectations

Maintainers may request a narrower patch, additional synthetic evidence, a
provenance update, or fresh-host validation. Passing tests is necessary but
does not by itself establish release readiness, legal compliance, audit
completion, or safety.
