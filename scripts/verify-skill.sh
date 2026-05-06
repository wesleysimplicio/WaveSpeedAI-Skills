#!/usr/bin/env bash
# Verify a freshly-installed wavespeed skill is wired up correctly.
# Runs read-only checks. Does NOT call WaveSpeed APIs unless WAVESPEED_API_KEY is set.

set -euo pipefail

red()   { printf '\033[31m%s\033[0m\n' "$*"; }
green() { printf '\033[32m%s\033[0m\n' "$*"; }
yellow(){ printf '\033[33m%s\033[0m\n' "$*"; }

fail=0

check() {
  local label=$1 cmd=$2
  if eval "$cmd" >/dev/null 2>&1; then
    green "OK    $label"
  else
    red   "FAIL  $label  ($cmd)"
    fail=$((fail+1))
  fi
}

echo "wavespeed skill — verification"
echo "------------------------------"

check "wavespeed-cli on PATH"      'command -v wavespeed-cli'
check "venv python exists"         'test -x "$HOME/.local/share/wavespeed-skill/venv/bin/python"'
check "wavespeed SDK importable"   '"$HOME/.local/share/wavespeed-skill/venv/bin/python" -c "import wavespeed"'
check "requests importable"        '"$HOME/.local/share/wavespeed-skill/venv/bin/python" -c "import requests"'

# At least one SKILL.md installed somewhere
found=0
for p in \
  "$HOME/.claude/skills/wavespeed/SKILL.md" \
  "$HOME/.codex/skills/wavespeed/SKILL.md" \
  "$HOME/.hermes/skills/creative/wavespeed/SKILL.md" \
  "$HOME/.openclaw/skills/wavespeed/SKILL.md" \
  "$HOME/.cursor/skills/wavespeed/SKILL.md" \
  "$HOME/.windsurf/skills/wavespeed/SKILL.md" \
  "$HOME/.config/agentskills/wavespeed/SKILL.md"; do
  if [ -f "$p" ]; then
    green "OK    SKILL.md installed at $p"
    found=1
  fi
done
if [ $found -eq 0 ]; then
  red "FAIL  no SKILL.md found in any known agent directory — re-run install.sh"
  fail=$((fail+1))
fi

# Optional API smoke if key present
if [ -n "${WAVESPEED_API_KEY:-}" ]; then
  echo
  yellow "WAVESPEED_API_KEY detected — running live API smoke (1 cent or so)"
  check "balance call returns JSON" 'wavespeed-cli balance | python3 -c "import sys,json;json.load(sys.stdin)"'
  check "models list returns >0"    'test "$(wavespeed-cli models --names-only | wc -l)" -gt 0'
else
  echo
  yellow "WAVESPEED_API_KEY not set — skipping live API checks"
fi

echo
if [ $fail -gt 0 ]; then
  red "FAILED ($fail check(s))"
  exit 1
fi
green "ALL CHECKS PASSED"
