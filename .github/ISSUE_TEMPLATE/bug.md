---
name: Bug report
about: Something is broken — installer fails, CLI crashes, SKILL.md doesn't load, etc.
title: "[bug] "
labels: bug
assignees: ""
---

## Summary

A short, plain-English description of what went wrong.

## Steps to reproduce

1. ...
2. ...
3. ...

## What happened

Paste the error output, stack trace, or screenshot. **Redact any API keys.**

```text
<paste here>
```

## What you expected

What did you think would happen?

## Environment

- OS: <macOS 14.5 / Ubuntu 22.04 / Windows 11 + WSL2 / etc.>
- Shell: <zsh / bash / fish>
- Python: <output of `python3 --version`>
- Agent host: <Claude Code / Codex / Hermes Agent / OpenClaw / Cursor / Windsurf / generic>
- Skill version: <output of `cat ~/.local/share/wavespeed-skill/VERSION` if it exists, otherwise commit hash>
- WaveSpeed SDK: <output of `pip show wavespeed | grep Version`>

## Anything else

Logs, related issues, theories, what you've already tried.
