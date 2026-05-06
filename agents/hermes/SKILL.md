---
name: wavespeed
description: "WaveSpeedAI inference gateway — 700+ media models (FLUX, Kling, Veo, Luma, Seedance, Z-Image, Wan, Qwen, Higgsfield) and 290+ OpenAI-compatible LLMs (Claude, GPT, Gemini, Llama, DeepSeek, Mistral) through one API key. Wraps the official Python SDK and a thin CLI."
version: 1.0.0
author: WaveSpeedAI-Skills contributors
license: MIT
platforms: [macos, linux]
metadata:
  hermes:
    tags: [media-generation, image, video, audio, llm, ai, wavespeed]
    related_skills: [comfyui, creative-campaign-media-studio, imagineart]
prerequisites:
  commands: [wavespeed-cli]
  env: [WAVESPEED_API_KEY]
---

# WaveSpeedAI

Unified inference gateway. Async-by-default with automatic polling. One API key, one CLI, one Python SDK for both media and LLM workloads.

## Prerequisites

- macOS or Linux.
- Set `WAVESPEED_API_KEY` (get one at https://wavespeed.ai/accesskey).
- CLI installed at `~/.local/bin/wavespeed-cli` (Python venv at `~/.local/share/wavespeed-skill/venv` with `wavespeed>=1.0.8`).
- If missing: `bash <(curl -fsSL https://raw.githubusercontent.com/wesleysimplicio/WaveSpeedAI-Skills/main/install.sh) --yes --agents hermes`.

## When to use

- User asks to generate an image, video, audio clip, or avatar.
- User mentions a `wavespeed-ai/*` model uuid.
- User wants to upload a local file as input for image-to-X.
- User wants to call Claude / GPT / Gemini / Llama via WaveSpeed's OpenAI-compatible LLM proxy.
- User asks for the WaveSpeed model catalog or balance.

## When NOT to use

- ComfyUI graph workflows → use `comfyui` skill.
- ImagineArt browser automation → use `imagineart` skill.
- Direct OpenAI / Anthropic API calls (no WaveSpeed proxy) → use the vendor SDK.
- Local-only generation (Stable Diffusion on disk) → out of scope.

## Quick reference

### Media generation

```bash
# Text → image (Z-Image turbo, fastest)
wavespeed-cli run wavespeed-ai/z-image/turbo '{"prompt":"Cat in tuxedo"}'

# Text → image (FLUX dev with format)
wavespeed-cli run wavespeed-ai/flux-dev '{"prompt":"...", "output_format":"png", "size":"1024x1024"}'

# Image → video (Seedance v2)
URL=$(wavespeed-cli upload ./input.png)
wavespeed-cli run wavespeed-ai/seedance-v2 '{"image":"'"$URL"'","prompt":"camera dolly in"}'

# Text → video w/ audio (Veo 3)
wavespeed-cli run wavespeed-ai/veo-3 '{"prompt":"thunderstorm at dusk, cinematic"}'

# Sync mode (no polling, single request)
wavespeed-cli run wavespeed-ai/z-image/turbo '{"prompt":"Cat"}' --sync
```

The CLI prints the full JSON envelope. Output URLs live at `.outputs[]`.

### Submit / result / cancel (with webhook)

```bash
wavespeed-cli submit wavespeed-ai/veo-3 '{"prompt":"..."}' --webhook-url https://app/cb
wavespeed-cli result <id> --wait
wavespeed-cli cancel <id>
```

### Upload local asset

```bash
URL=$(wavespeed-cli upload /path/to/image.png)
echo "$URL"     # https://wavespeed-cdn.../...
```

### List models / balance

```bash
wavespeed-cli models --names-only      # ids only
wavespeed-cli models --filter video    # JSON, filtered
wavespeed-cli balance                  # account balance
```

### LLM (OpenAI-compatible)

```bash
wavespeed-cli llm anthropic/claude-opus-4.6 "Summarize WaveSpeed in 10 words."
wavespeed-cli llm openai/gpt-5.2-pro "..." --system "Be terse."
wavespeed-cli llm google/gemini-3-flash-preview "..." --json-mode
wavespeed-cli llm deepseek/deepseek-v4 "..." --stream
wavespeed-cli llm meta-llama/llama-4-70b "..." --raw
```

Base URL: `https://llm.wavespeed.ai/v1`. Drop-in for any OpenAI client.

## Python SDK

```python
import wavespeed

out = wavespeed.run("wavespeed-ai/z-image/turbo", {"prompt": "Cat"})
print(out["outputs"][0])

# Tuning
out = wavespeed.run(model, payload, timeout=600.0, poll_interval=1.0, enable_sync_mode=False)

# Explicit client w/ retries
from wavespeed import Client
client = Client(api_key="...", max_retries=3, max_connection_retries=5, retry_interval=1.0)

# Upload
url = wavespeed.upload("/path/to/image.png")
```

Run scripts against the dedicated venv:

```bash
~/.local/share/wavespeed-skill/venv/bin/python myscript.py
```

Or ad-hoc:

```bash
uv run --with wavespeed python myscript.py
```

## Serverless worker

```python
import wavespeed.serverless as serverless

async def handler(job):
    return {"output": job["input"]["prompt"].upper()}

serverless.start({"handler": handler})
```

Local dev:

```bash
python handler.py --test_input '{"input":{"prompt":"hi"}}'
python handler.py --waverless_serve_api --waverless_api_port 8000
```

Worker env: `WAVERLESS_POD_ID`, `WAVERLESS_API_KEY`, `WAVERLESS_WEBHOOK_GET_JOB`, `WAVERLESS_WEBHOOK_POST_OUTPUT`.

## REST primitives

```bash
# Submit
curl -X POST "https://api.wavespeed.ai/api/v3/<model_uuid>" \
  -H "Authorization: Bearer $WAVESPEED_API_KEY" -H "Content-Type: application/json" \
  -d '{...}'

# Poll
curl "https://api.wavespeed.ai/api/v3/predictions/<id>/result" \
  -H "Authorization: Bearer $WAVESPEED_API_KEY"
```

Errors: `401` bad key, `429` rate-limited (back off), `400` schema mismatch, `402` insufficient balance.

## Frequently-used uuids

| Family | uuid | Purpose |
|---|---|---|
| Z-Image | `wavespeed-ai/z-image/turbo` | fastest text→image |
| FLUX | `wavespeed-ai/flux-dev`, `wavespeed-ai/flux-pro` | high-quality text→image |
| FLUX LoRA | `wavespeed-ai/flux-dev-lora` | text→image w/ custom LoRA |
| Seedance | `wavespeed-ai/seedance-v2` | image→video |
| Kling | `wavespeed-ai/kling-v2.1` | image/text→video |
| Veo | `wavespeed-ai/veo-3`, `wavespeed-ai/veo-3-fast` | text→video w/ audio |
| Luma | `wavespeed-ai/luma-dream-machine` | text/image→video |
| Wan | `wavespeed-ai/wan-2.7` | text→video |
| Qwen Image | `wavespeed-ai/qwen-image-2` | text→image |
| Higgsfield | `wavespeed-ai/higgsfield-soul-id` | identity-preserving portrait |
| Audio | `wavespeed-ai/ace-step` | audio gen / edit |
| LLM | `anthropic/claude-opus-4.6`, `openai/gpt-5.2-pro`, `google/gemini-3-flash-preview` | chat |

Live catalog: `wavespeed-cli models --names-only`.

## Latency / cost knobs

- `--timeout 600` for image, `--timeout 1800` for video. Default is 10h (too long for interactive).
- `--poll-interval 0.5` for fast image loops; `1.0` for video.
- `--sync` skips polling — only for sub-30s models.

## Troubleshooting

- `401` → API key missing or revoked.
- `402` → insufficient balance / tier locked. `wavespeed-cli balance`.
- `429` → rate-limited; raise `retry_interval` or batch.
- `400` → payload schema mismatch; check the model's page on `wavespeed.ai/models`.
- Stuck job → `wavespeed-cli cancel <id>` and re-submit with smaller `--timeout`.

## References

- Docs: https://wavespeed.ai/docs
- Python SDK: https://github.com/WaveSpeedAI/wavespeed-python
- Models catalog: https://wavespeed.ai/models
- API key: https://wavespeed.ai/accesskey
- API base: `https://api.wavespeed.ai/api/v3`
- LLM base: `https://llm.wavespeed.ai/v1`
- Skill repo: https://github.com/wesleysimplicio/WaveSpeedAI-Skills
