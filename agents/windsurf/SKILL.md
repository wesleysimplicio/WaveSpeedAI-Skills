---
name: wavespeed
description: WaveSpeedAI inference gateway — 700+ media models and 290+ OpenAI-compatible LLMs in one API. Use for AI image/video/audio generation and for cheap proxied LLM calls.
---

# WaveSpeedAI (Windsurf)

## When to invoke

- AI media generation (image/video/audio/avatar).
- Any `wavespeed-ai/*` uuid.
- LLM calls through the WaveSpeed proxy (`anthropic/`, `openai/`, `google/`, etc.).

## Setup

```bash
export WAVESPEED_API_KEY="ws_..."
```

CLI: `~/.local/bin/wavespeed-cli`. Install with `bash install.sh --agents windsurf`.

## Cheatsheet

```bash
# Image
wavespeed-cli run wavespeed-ai/z-image/turbo '{"prompt":"..."}'
wavespeed-cli run wavespeed-ai/flux-dev '{"prompt":"...","size":"1024x1024"}'

# Video
URL=$(wavespeed-cli upload ./hero.png)
wavespeed-cli run wavespeed-ai/seedance-v2 '{"image":"'"$URL"'","prompt":"slow dolly"}'
wavespeed-cli run wavespeed-ai/veo-3 '{"prompt":"..."}'

# Async
wavespeed-cli submit <model> '{"prompt":"..."}' --webhook-url https://app/cb
wavespeed-cli result <id> --wait
wavespeed-cli cancel <id>

# LLM
wavespeed-cli llm anthropic/claude-opus-4.6 "Hello" --system "Be terse."
wavespeed-cli llm openai/gpt-5.2-pro "..." --stream

# Catalog
wavespeed-cli models --names-only
wavespeed-cli balance
```

## Refs

- https://github.com/wesleysimplicio/WaveSpeedAI-Skills
- https://wavespeed.ai/docs
