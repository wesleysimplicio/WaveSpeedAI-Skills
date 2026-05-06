## What

A one-line summary of the change.

## Why

Why is this change worth landing? Bug, missing host, stale model in the catalog, etc.

## Type

- [ ] New host (`agents/<host>/SKILL.md` + `install.sh` mapping)
- [ ] Model catalog update (`references/models.md`)
- [ ] Reference doc fix (`references/*.md`)
- [ ] New cookbook entry (`examples/*.md`)
- [ ] CLI change (`cli/cli.py` / `cli/wavespeed-cli`)
- [ ] Installer change (`install.sh`)
- [ ] Docs / typo / housekeeping

## Test plan

- [ ] `shellcheck install.sh cli/wavespeed-cli` passes locally
- [ ] `python -m py_compile cli/cli.py` passes
- [ ] `bash install.sh --yes --agents generic` succeeds on a clean shell
- [ ] If the change touches a specific host, the SKILL.md loads on that host (note the version tested)
- [ ] CHANGELOG.md updated under `[Unreleased]`

## Notes for the reviewer

Anything you want a second pair of eyes on, follow-up work you intentionally left out, or context that's not obvious from the diff.
