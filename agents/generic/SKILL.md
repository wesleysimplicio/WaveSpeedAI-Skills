---
name: wavespeed
description: |
  Generate images, video, audio and avatars (700+ models) or call OpenAI-compatible LLMs (290+ models — Claude, GPT, Gemini, DeepSeek, Llama) through the WaveSpeedAI inference platform. Use whenever the user asks to create AI media, run a `wavespeed-ai/*` model, upload a media asset for inference, list available models, check account balance, or call an LLM via the WaveSpeed proxy.
---

# WaveSpeedAI — generic skill (any agent that follows the agentskills.io spec)

This file is intentionally portable. Copy it into whichever skill directory your host agent reads from.

## Setup

```bash
export WAVESPEED_API_KEY="ws_..."     # https://wavespeed.ai/accesskey
```

CLI shim: `~/.local/bin/wavespeed-cli` (run `bash install.sh` from the repo).

## Trigger conditions

- User asks for AI media generation (image / video / audio / avatar).
- User mentions a `wavespeed-ai/*` uuid.
- User wants to upload a local file as input for image-to-X.
- User wants to call Claude / GPT / Gemini / Llama via the WaveSpeed LLM proxy.
- User asks for the WaveSpeed model catalog or balance.

## Surface

```bash
wavespeed-cli run     <model_uuid> '<json>'    # submit + poll until terminal
wavespeed-cli submit  <model_uuid> '<json>'    # submit only; print task id
wavespeed-cli result  <task_id>                # fetch result
wavespeed-cli cancel  <task_id>                # cancel/delete
wavespeed-cli upload  <path>                   # upload local asset
wavespeed-cli models  [--names-only|--filter]  # catalog
wavespeed-cli balance                          # account balance
wavespeed-cli llm     <model> '<prompt>'       # OpenAI-compatible chat
wavespeed-cli verify-webhook <body> <sig>      # HMAC-SHA256 webhook verify
```

## Examples

```bash
# Text → image
wavespeed-cli run wavespeed-ai/z-image/turbo '{"prompt":"Cat in tuxedo"}'

# Image → video
URL=$(wavespeed-cli upload ./input.png)
wavespeed-cli run wavespeed-ai/seedance-v2 '{"image":"'"$URL"'","prompt":"camera dolly"}'

# Text → video w/ audio
wavespeed-cli run wavespeed-ai/veo-3 '{"prompt":"thunderstorm at dusk, cinematic"}'

# LLM
wavespeed-cli llm anthropic/claude-opus-4.6 "Summarize in one sentence."
```

## Python SDK

```python
import wavespeed
out = wavespeed.run("wavespeed-ai/z-image/turbo", {"prompt": "Cat"})
print(out["outputs"][0])

url = wavespeed.upload("/path/to/image.png")
```

Use the dedicated venv: `~/.local/share/wavespeed-skill/venv/bin/python script.py`.

## Errors

- `401` → key missing or revoked.
- `400` → payload doesn't match the model schema.
- `402` → insufficient balance / tier locked.
- `404` → task or model not found.
- `429` → rate-limited; back off.
- `5xx` → upstream error; retry idempotent submits.

## Refs

- Docs: https://wavespeed.ai/docs
- Skill repo: https://github.com/wesleysimplicio/WaveSpeedAI-Skills
- Python SDK: https://github.com/WaveSpeedAI/wavespeed-python
- API key: https://wavespeed.ai/accesskey
