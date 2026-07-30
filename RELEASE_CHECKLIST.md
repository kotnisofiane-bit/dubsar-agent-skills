# Release checklist

- [x] Separate licence audit approves the selected MIT licence.
- [x] `LICENSE` is added to the repository and both distributable packages.
- [x] Repository and homepage URLs are finalized in host manifests.
- [x] `PROVENANCE.json` is human-reviewed.
- [ ] `npm test` passes on Windows and Linux.
- [ ] Claude Code marketplace validation passes without warnings.
- [ ] Cursor manifests match the current official JSON schemas.
- [ ] Codex plugin and all skills pass their standard validators.
- [ ] Hermes direct-install pack includes every referenced support file.
- [x] Private local signal scan reports zero findings.
- [x] Human clean-room review confirms no production implementation detail.
- [ ] Release archive is generated from the reviewed Git commit.
- [ ] Installation commands are tested from a fresh user profile.

Do not release merely because the development checks pass. Complete every
remaining installation and cross-platform validation item first.
