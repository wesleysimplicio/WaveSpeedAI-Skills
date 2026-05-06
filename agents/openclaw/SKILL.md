---
name: wavespeed
description: WaveSpeedAI inference gateway — 700+ media models (FLUX, Kling, Veo, Luma, Seedance, Z-Image, Wan, Qwen, Higgsfield, ace-step) and 290+ OpenAI-compatible LLMs through one API key. Use whenever the user wants to generate AI media, list available models, check balance, or call Claude/GPT/Gemini through the WaveSpeed LLM proxy.
version: 1.0.0
author: WaveSpeedAI-Skills contributors
license: MIT
tags:
  - media
  - image
  - video
  - audio
  - llm
  - wavespeed
  - inference
---

# WaveSpeedAI (OpenClaw)

Unified inference gateway. Async-by-default with automatic polling. Same surface for image/video/audio and LLM.

## When to use

- User asks for AI media generation (image, video, audio, avatar).
- User mentions a `wavespeed-ai/*` model uuid.
- User wants to upload a local image/video as input for image-to-X.
- User wants to call Claude / GPT / Gemini / Llama through the WaveSpeed LLM proxy.
- User wants the WaveSpeed model catalog or account balance.

## Setup

```bash
export WAVESPEED_API_KEY="ws_..."
# Install once if missing:
bash <(curl -fsSL https://raw.githubusercontent.com/wesleysimplicio/WaveSpeedAI-Skills/main/install.sh) \
  --yes --agents openclaw
```

## CLI

```bash
# Generate
wavespeed-cli run wavespeed-ai/z-image/turbo '{"prompt":"Cat"}'
wavespeed-cli run wavespeed-ai/flux-dev '{"prompt":"...","output_format":"png"}'
URL=$(wavespeed-cli upload ./input.png)
wavespeed-cli run wavespeed-ai/seedance-v2 '{"image":"'"$URL"'","prompt":"dolly in"}'

# Submit / result / cancel
wavespeed-cli submit wavespeed-ai/veo-3 '{"prompt":"..."}' --webhook-url https://app/cb
wavespeed-cli result <id> --wait
wavespeed-cli cancel <id>

# Models & balance
wavespeed-cli models --names-only
wavespeed-cli balance

# LLM
wavespeed-cli llm anthropic/claude-opus-4.6 "Hello" --system "Be terse."
wavespeed-cli llm openai/gpt-5.2-pro "..." --stream
```

## Common model uuids

| Use | uuid |
|---|---|
| Fast text→image | `wavespeed-ai/z-image/turbo` |
| Quality text→image | `wavespeed-ai/flux-dev`, `wavespeed-ai/flux-pro` |
| Image→video | `wavespeed-ai/seedance-v2`, `wavespeed-ai/kling-v2.1` |
| Text→video w/ audio | `wavespeed-ai/veo-3` |
| Audio | `wavespeed-ai/ace-step` |
| LLM | `anthropic/claude-opus-4.6`, `openai/gpt-5.2-pro`, `google/gemini-3-flash-preview` |

## Errors

`401` bad key · `400` payload schema · `402` insufficient balance · `404` not found · `429` rate-limited · `5xx` upstream.

## Refs

- Docs: https://wavespeed.ai/docs
- API key: https://wavespeed.ai/accesskey
- Models: https://wavespeed.ai/models
- Skill repo: https://github.com/wesleysimplicio/WaveSpeedAI-Skills
