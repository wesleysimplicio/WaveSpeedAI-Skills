#!/usr/bin/env bash
# WaveSpeedAI-Skills installer.
#
# Provisions an isolated Python venv for the wavespeed CLI, copies the shim
# to ~/.local/bin/, and installs SKILL.md files into every supported agent
# directory it can find.
#
# Usage:
#     bash install.sh                   # interactive: prompts before each agent
#     bash install.sh --yes             # non-interactive, install everywhere
#     bash install.sh --agents claude,codex
#     bash install.sh --uninstall
set -euo pipefail

REPO_RAW="https://raw.githubusercontent.com/wesleysimplicio/WaveSpeedAI-Skills/main"
VENV_DIR="${WAVESPEED_VENV_DIR:-$HOME/.local/share/wavespeed-skill/venv}"
SHARE_DIR="$(dirname "$VENV_DIR")"
BIN_DIR="$HOME/.local/bin"
PY_VERSION="${WAVESPEED_PY_VERSION:-3.12}"
WAVESPEED_PIN="${WAVESPEED_PIN:-wavespeed>=1.0.8}"

YES=0
UNINSTALL=0
AGENTS=""
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]:-$0}")" &> /dev/null && pwd)"
SOURCE_MODE="local"
[ ! -f "$SCRIPT_DIR/cli/cli.py" ] && SOURCE_MODE="remote"

c_red()   { printf "\033[31m%s\033[0m" "$*"; }
c_green() { printf "\033[32m%s\033[0m" "$*"; }
c_blue()  { printf "\033[34m%s\033[0m" "$*"; }
c_dim()   { printf "\033[2m%s\033[0m" "$*"; }
log()  { printf "  %s %s\n" "$(c_blue '›')" "$*"; }
ok()   { printf "  %s %s\n" "$(c_green '✓')" "$*"; }
warn() { printf "  %s %s\n" "$(c_red '!')" "$*" >&2; }

while [ $# -gt 0 ]; do
    case "$1" in
        -y|--yes) YES=1; shift ;;
        --uninstall) UNINSTALL=1; shift ;;
        --agents) AGENTS="$2"; shift 2 ;;
        --agents=*) AGENTS="${1#*=}"; shift ;;
        -h|--help)
            sed -n '2,18p' "$0"; exit 0 ;;
        *) warn "unknown flag: $1"; exit 2 ;;
    esac
done

# Map of supported agents → SKILL.md target path on disk.
agent_path() {
    case "$1" in
        claude)   echo "$HOME/.claude/skills/wavespeed/SKILL.md" ;;
        codex)    echo "$HOME/.codex/skills/wavespeed/SKILL.md" ;;
        hermes)   echo "$HOME/.hermes/skills/creative/wavespeed/SKILL.md" ;;
        openclaw) echo "$HOME/.openclaw/skills/wavespeed/SKILL.md" ;;
        cursor)   echo "$HOME/.cursor/skills/wavespeed/SKILL.md" ;;
        windsurf) echo "$HOME/.windsurf/skills/wavespeed/SKILL.md" ;;
        generic)  echo "$HOME/.config/agent-skills/wavespeed/SKILL.md" ;;
        *) return 1 ;;
    esac
}

ALL_AGENTS=(claude codex hermes openclaw cursor windsurf generic)

read_into() {
    local src="$1" dst="$2"
    mkdir -p "$(dirname "$dst")"
    if [ "$SOURCE_MODE" = "local" ]; then
        cp "$SCRIPT_DIR/$src" "$dst"
    else
        curl -fsSL "$REPO_RAW/$src" -o "$dst"
    fi
}

prompt_yes() {
    [ "$YES" -eq 1 ] && return 0
    printf "  %s install %s? [y/N] " "$(c_blue '?')" "$1"
    read -r ans
    [[ "${ans,,}" =~ ^y(es)?$ ]]
}

uninstall_all() {
    log "removing CLI venv at $VENV_DIR"
    rm -rf "$VENV_DIR"
    rm -f "$BIN_DIR/wavespeed-cli" "$SHARE_DIR/cli.py"
    for a in "${ALL_AGENTS[@]}"; do
        local p; p="$(agent_path "$a")" || continue
        if [ -d "$(dirname "$p")" ]; then
            rm -rf "$(dirname "$p")"
            ok "removed $a SKILL"
        fi
    done
    ok "uninstall complete"
}

ensure_venv() {
    log "provisioning Python venv at $VENV_DIR"
    mkdir -p "$SHARE_DIR" "$BIN_DIR"
    if command -v uv >/dev/null 2>&1; then
        uv venv --python "$PY_VERSION" "$VENV_DIR" >/dev/null
        uv pip install --quiet --python "$VENV_DIR/bin/python" "$WAVESPEED_PIN" requests
    else
        if ! command -v "python$PY_VERSION" >/dev/null 2>&1 && ! command -v python3 >/dev/null 2>&1; then
            warn "neither uv nor python3 found. Install uv: https://docs.astral.sh/uv/"
            exit 1
        fi
        local py; py="$(command -v "python$PY_VERSION" || command -v python3)"
        "$py" -m venv "$VENV_DIR"
        "$VENV_DIR/bin/python" -m pip install --quiet --upgrade pip
        "$VENV_DIR/bin/python" -m pip install --quiet "$WAVESPEED_PIN" requests
    fi
    ok "venv ready"
}

install_cli() {
    log "installing CLI shim and Python core"
    read_into "cli/cli.py" "$SHARE_DIR/cli.py"
    read_into "cli/wavespeed-cli" "$BIN_DIR/wavespeed-cli"
    chmod +x "$BIN_DIR/wavespeed-cli"
    ok "wavespeed-cli installed at $BIN_DIR/wavespeed-cli"
    case ":$PATH:" in
        *":$BIN_DIR:"*) ;;
        *) warn "$BIN_DIR is not in your PATH. Add: export PATH=\"$BIN_DIR:\$PATH\"" ;;
    esac
}

install_agent() {
    local agent="$1"
    local target; target="$(agent_path "$agent")"
    read_into "agents/$agent/SKILL.md" "$target"
    ok "$agent SKILL → $target"
}

# ---- main -------------------------------------------------------------------

printf "\n%s WaveSpeedAI-Skills installer\n\n" "$(c_blue '◆')"

if [ "$UNINSTALL" -eq 1 ]; then
    uninstall_all
    exit 0
fi

ensure_venv
install_cli

if [ -n "$AGENTS" ]; then
    IFS=',' read -ra picks <<< "$AGENTS"
    for a in "${picks[@]}"; do
        install_agent "$a"
    done
else
    for a in "${ALL_AGENTS[@]}"; do
        if prompt_yes "$a SKILL"; then
            install_agent "$a"
        else
            printf "  %s skipping %s\n" "$(c_dim '·')" "$a"
        fi
    done
fi

printf "\n%s done. Set WAVESPEED_API_KEY and run: %s\n" "$(c_green '✓')" "$(c_blue 'wavespeed-cli models --names-only | head')"
printf "  Get a key at https://wavespeed.ai/accesskey\n\n"
