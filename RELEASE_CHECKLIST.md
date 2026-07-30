# Release checklist

- [x] Separate licence audit approves the selected MIT licence.
- [x] `LICENSE` is added to the repository and both distributable packages.
- [x] Repository and homepage URLs are finalized in host manifests.
- [x] `PROVENANCE.json` is human-reviewed.
- [x] `npm test` passes on Windows and Linux with Node.js 20 and 22.
- [x] Claude Code marketplace validation passes without warnings.
- [x] Cursor manifests match the current official JSON schemas.
- [x] Codex plugin and all skills pass their standard validators.
- [x] Hermes direct-install pack includes every referenced support file.
- [x] Private local signal scan reports zero findings.
- [x] Human clean-room review confirms no production implementation detail.
- [ ] Release archive is generated from the reviewed Git commit.
- [x] Both packs install from the public marketplace in a fresh Claude Code
  profile and expose six skills each.

Do not release merely because the development checks pass. Complete every
remaining installation and cross-platform validation item first.
