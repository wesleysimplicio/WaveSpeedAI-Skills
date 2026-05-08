# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [SemVer](https://semver.org/).

## [Unreleased]

## [1.2.0] - 2026-05-08

### Added
- `pyproject.toml` `[project]` table with setuptools build-system, name `wavespeedai-skills`, console-script `wavespeed-cli` resolving to `wavespeedai_skills.cli:main`, runtime dep `wavespeed>=1.0.8`.
- `cli/__init__.py` (empty) so setuptools recognizes `cli/` as a Python package, mapped to import name `wavespeedai_skills` via `[tool.setuptools.package-dir]`.
- Distributed as a Python package on PyPI (`pip install wavespeedai-skills`).

### Changed
- Bump VERSION 1.1.0 -> 1.2.0 (minor: PyPI distribution added).

## [1.1.0] - 2026-05-07

### Added
- Adopted `agentic-starter` scaffold: `AGENTS.md`, `CLAUDE.md`, `.specs/{product,architecture,workflow,sprints}/`, `.skills/`, `.claude/{settings.json,hooks/}`, `.codex/config.toml`, `.github/{workflows/dod.yml,PULL_REQUEST_TEMPLATE.md,ISSUE_TEMPLATE/,copilot-instructions.md}`, `playwright.config.ts`, `presentation/`.
- `VERSION` file (pyproject.toml has no `[project]` block).
- `.specs/product/{VISION,DOMAIN,PERSONAS}.md` mapped to Skill, Task (Prediction), Upload, LlmCompletion, WebhookEvent.
- `.specs/architecture/{DESIGN,PATTERNS}.md` aligned with bash CLI + Python helper stack.
- `.specs/sprints/BACKLOG.md` from real TODOs.

### Changed
- Bump VERSION 1.0.0 -> 1.1.0 (minor: structure added).
- `AGENTS.md`/`CLAUDE.md`/`.github/copilot-instructions.md` aligned with real stack.

## [1.0.0] - 2026-05-06

### Added
- Per-agent `SKILL.md` files for Claude Code, Codex, Hermes Agent, OpenClaw, Cursor, Windsurf, and a generic portable variant.
- `wavespeed-cli` Python wrapper with subcommands: `run`, `submit`, `result`, `cancel`, `upload`, `models` (with `--filter` / `--names-only`), `balance`, `llm` (with `--system`, `--json-mode`, `--stream`, `--temperature`, `--max-tokens`, `--raw`), `verify-webhook`.
- One-line `install.sh` that provisions an isolated Python venv, installs the official `wavespeed` SDK, drops the CLI shim into `~/.local/bin`, and copies SKILL files into every supported agent directory found on the host. Supports `--yes`, `--agents`, `--uninstall`.
- Cookbook examples: text→image, image→video, text→video with audio (Veo 3), LLM chat, LoRA stacking, serverless workers, webhooks, batch jobs.
- Reference docs: curated model catalog, REST API, error codes, rate limits, webhooks (HMAC-SHA256 verification).
- GitHub Actions CI: shellcheck for bash, ruff + mypy for Python.
- Issue templates and pull request template.
- MIT license, contributing guide, code of conduct.

### Notes
- Tested against `wavespeed==1.0.8` and Python 3.12.
- Not affiliated with WaveSpeedAI Inc. Community-maintained.
