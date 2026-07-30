# Public boundary

These packs are a deliberately small, offline preparation layer.

## Included

- portable Agent Skills;
- deterministic local scripts using only Node.js built-ins;
- synthetic examples and non-authoritative templates;
- local validation, hashing, inventory, and human-review preparation;
- thin manifests for Claude Code, Codex, Cursor, and Hermes-compatible skills.

## Excluded

- production DUBSAR implementation details;
- internal tool names, routes, protocols, repositories, and deployment topology;
- production connectors, credentials, activation, and billing;
- enforcement, runtime interception, or automatic permission grants;
- hooks and background execution;
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
