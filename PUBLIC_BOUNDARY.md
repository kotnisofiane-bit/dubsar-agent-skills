# Public boundary

These packs are a deliberately small, offline preparation layer.

## Relationship to DUBSAR

The MIT license applies only to the files in this repository. These packs are
a public adaptation of the DUBSAR governance doctrine, not a distribution of
the separate private DUBSAR product, Core, or runtime. See the
[DUBSAR website](https://dubsar.ai/) and
[public documentation](https://github.com/kotnisofiane-bit/DUBSAR) for public
product context.

## Included

- portable Agent Skills;
- a lightweight public adaptation of DUBSAR governance doctrine through local
  contracts and deterministic helpers;
- deterministic local scripts using only Node.js built-ins;
- synthetic examples and non-authoritative templates;
- local validation, hashing, inventory, and human-review preparation;
- thin manifests for Claude Code, Codex, Cursor, and Hermes-compatible skills.

## Excluded

- production DUBSAR implementation details;
- DUBSAR Core, MCP servers, product hooks, enforcement runtimes, background
  orchestration, and canonical session or execution records;
- internal tool names, routes, protocols, repositories, and deployment topology;
- production connectors, credentials, activation, and billing;
- enforcement, runtime interception, or automatic permission grants;
- claims of certification, legal compliance, or completed audit.

The public packs may say that evidence is structurally ready for human review.
They must never conclude that a system is compliant, safe, approved, or
certified.

## Safe execution contract

Scripts:

- accept an explicit input or output directory;
- reject traversal and symbolic links;
- never read environment variables;
- never access the network;
- never delete or overwrite a non-empty target;
- write stable UTF-8 JSON with sorted keys and SHA-256 inventories;
- report only relative paths.

## Release gate

Development mode checks the executable and documentation boundary. Release
mode additionally requires the approved MIT licence, an approved provenance
manifest, a deterministic file inventory, passing tests, and a clean private
signal scan.
