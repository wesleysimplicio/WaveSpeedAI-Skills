# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [SemVer](https://semver.org/).

## [Unreleased]

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
