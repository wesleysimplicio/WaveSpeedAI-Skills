---
name: wavespeed
description: WaveSpeedAI inference gateway — 700+ media models and 290+ OpenAI-compatible LLMs through one API key. Use for AI media generation (image/video/audio/avatar) and for cheap proxied LLM calls (Claude/GPT/Gemini/Llama).
---

# WaveSpeedAI (Cursor)

## When to invoke

- User asks for image / video / audio / avatar generation.
- User mentions any `wavespeed-ai/*` uuid.
- User wants to upload a local file as input for image-to-X.
- User wants to call Claude/GPT/Gemini/Llama via the WaveSpeed LLM proxy.

## Setup

```bash
export WAVESPEED_API_KEY="ws_..."     # https://wavespeed.ai/accesskey
```

CLI shim: `~/.local/bin/wavespeed-cli` (run `install.sh` from the repo if missing).

## CLI cheatsheet

```bash
wavespeed-cli run wavespeed-ai/z-image/turbo '{"prompt":"Cat"}'
URL=$(wavespeed-cli upload ./input.png)
wavespeed-cli run wavespeed-ai/seedance-v2 '{"image":"'"$URL"'","prompt":"camera dolly"}'
wavespeed-cli submit wavespeed-ai/veo-3 '{"prompt":"..."}' --webhook-url https://app/cb
wavespeed-cli result <id> --wait
wavespeed-cli models --names-only
wavespeed-cli balance
wavespeed-cli llm anthropic/claude-opus-4.6 "Summarize in one sentence."
```

Output URLs live at `.outputs[]` of the printed JSON.

## Python (one-off)

```python
import wavespeed
out = wavespeed.run("wavespeed-ai/z-image/turbo", {"prompt": "Cat"})
print(out["outputs"][0])
```

## Refs

- Skill repo: https://github.com/wesleysimplicio/WaveSpeedAI-Skills
- Docs: https://wavespeed.ai/docs
