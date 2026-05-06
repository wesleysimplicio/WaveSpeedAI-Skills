# Contributing to WaveSpeedAI-Skills

Thanks for being here. PRs and issues are welcome.

## Quick start

```bash
git clone https://github.com/wesleysimplicio/WaveSpeedAI-Skills.git
cd WaveSpeedAI-Skills
bash install.sh --yes
```

That installs the CLI and skill files into your local agent directories so you can dogfood your changes.

## What kinds of contributions help most

- **New host coverage.** If your agent reads `SKILL.md` from a directory we don't list, add `agents/<host>/SKILL.md` and wire it into `install.sh`. See `agents/generic/SKILL.md` for a portable starting point.
- **Model catalog updates.** WaveSpeed ships new model families weekly. If `references/models.md` is stale, fix it. Don't try to mirror the full 700+ list — just keep the curated short list current.
- **Cookbook entries.** Pick a model we don't show off yet (lipsync, 3D, audio music, edition models) and add `examples/NN-<topic>.md`.
- **Reference doc clarifications.** If you hit an undocumented error code, payload field, or webhook header in the wild, add it to the appropriate `references/*.md` file with a short example.
- **CLI flags.** Surface a useful SDK option that the CLI doesn't expose yet. Keep it minimal — most users want sane defaults, not 40 flags.
- **Translations.** README in PT-BR, ES, ZH, JA, FR — happy to land them as `README.<locale>.md` with a language switcher in the header.

## What we won't merge

- A wrapper that hides the underlying API. The skill stays thin — agents need to be able to read the bash and understand it.
- Frontmatter changes that break a host's parser. If you're editing `agents/<host>/SKILL.md`, test it loads cleanly on that host before opening the PR.
- Hardcoded model uuids in the CLI. Models change. Use string args.
- Bundled API keys, fixtures with real keys, or anything that triggers `git-secrets`.

## Style

- Bash: two-space indent, `set -euo pipefail`, ShellCheck clean.
- Python: 4-space indent, type hints where they aid clarity, ruff clean (config in `pyproject.toml` once we add one), no emojis in code.
- Markdown: 80–100 column soft wrap, sentence case headers, no emojis except in lists where they aid scannability.
- Commits: imperative English mood, ~70 char subject. Body if needed.

## Testing locally

```bash
shellcheck install.sh cli/wavespeed-cli
python -m py_compile cli/cli.py
bash install.sh --yes --agents generic   # smoke test
WAVESPEED_API_KEY=$YOUR_KEY wavespeed-cli models --names-only | head
```

For a full end-to-end run, you'll need a WaveSpeed account with a small balance ($1 trial credit is enough for a few `z-image/turbo` calls).

## Pull requests

- Open one PR per logical change. A PR that touches the installer + adds a model + rewrites the README is three PRs.
- Update `CHANGELOG.md` under `[Unreleased]`.
- If your PR adds a new host, check the SKILL loads on that host and note the version you tested with.
- Mention if your change affects the wire format (CLI flags, env vars, default paths) — those need a SemVer minor bump at minimum.

## Releases

- Maintainer cuts releases. We tag `vX.Y.Z`, GitHub Actions builds release notes from `CHANGELOG.md`.
- Patch: bug fix, doc fix, dependency bump.
- Minor: new host, new CLI subcommand, new example.
- Major: anything that breaks an existing install path or removes a flag.

## Asking questions

- Bug or unexpected behavior → open an issue, fill the template.
- "Should I add X?" → open a discussion or draft PR. We'd rather see a small PR than a long thread.
- Sensitive disclosures (e.g. you found a way the installer could overwrite arbitrary files) → email the maintainer listed in `CODE_OF_CONDUCT.md`. Don't open a public issue.

## License

By contributing, you agree your contribution is licensed under the MIT license, the same as the rest of the repo.
