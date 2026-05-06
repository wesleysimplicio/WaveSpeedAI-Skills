---
name: wavespeed
description: Generate images, video, audio, avatars (700+ models — FLUX, Kling, Veo, Luma, Seedance, Z-Image, Wan) or call OpenAI-compatible LLMs (290+ — Claude, GPT, Gemini, DeepSeek, Llama) via the WaveSpeedAI inference platform. Wraps the official Python SDK plus a thin CLI shim.
---

# WaveSpeedAI skill

Unified inference gateway. Async-by-default with polling. One API key for both media and LLM workloads.

## When to invoke

- User asks to generate AI media (image / video / audio / avatar).
- User mentions a `wavespeed-ai/*` model uuid or `vendor/model` LLM id.
- User wants to upload a local file as input for image-to-X / video-to-X.
- User wants to list models or check WaveSpeed balance.
- User wants to call Claude / GPT / Gemini / Llama through the WaveSpeed LLM proxy.

## Prereqs

```bash
export WAVESPEED_API_KEY="ws_..."     # https://wavespeed.ai/accesskey
```

CLI: `~/.local/bin/wavespeed-cli` (uses `~/.local/share/wavespeed-skill/venv`).

## Subcommands

### `run` — submit a media job, poll, return JSON

```bash
wavespeed-cli run wavespeed-ai/z-image/turbo '{"prompt":"Cat"}'
wavespeed-cli run wavespeed-ai/flux-dev '{"prompt":"...","output_format":"png"}' --timeout 600
wavespeed-cli run wavespeed-ai/seedance-v2 '{"image":"<URL>","prompt":"dolly in"}' --sync
```

Output URLs at `.outputs[]`.

### `submit` / `result` / `cancel`

```bash
wavespeed-cli submit wavespeed-ai/veo-3 '{"prompt":"..."}' --webhook-url https://app/cb
wavespeed-cli result <id> --wait
wavespeed-cli cancel <id>
```

### `upload` — upload a local asset, print hosted URL

```bash
URL=$(wavespeed-cli upload ./input.png)
wavespeed-cli run wavespeed-ai/seedance-v2 \
  "$(jq -nc --arg u "$URL" '{image:$u, prompt:"camera pan"}')"
```

### `models` / `balance`

```bash
wavespeed-cli models --names-only
wavespeed-cli models --filter video
wavespeed-cli balance
```

### `llm` — OpenAI-compatible chat completion

```bash
wavespeed-cli llm anthropic/claude-opus-4.6 "Hello"
wavespeed-cli llm openai/gpt-5.2-pro "..." --system "Be terse."
wavespeed-cli llm google/gemini-3-flash-preview "..." --json-mode --raw
wavespeed-cli llm deepseek/deepseek-v4 "..." --stream
```

Base URL: `https://llm.wavespeed.ai/v1`.

### `verify-webhook`

```bash
WAVESPEED_WEBHOOK_SECRET=ws_secret \
  wavespeed-cli verify-webhook "$RAW_BODY" "$X_WEBHOOK_SIGNATURE"
```

## Python (scripting)

```python
import wavespeed

out = wavespeed.run("wavespeed-ai/z-image/turbo", {"prompt": "Cat"})
print(out["outputs"][0])

from wavespeed import Client
client = Client(api_key="...", max_retries=3, max_connection_retries=5, retry_interval=1.0)
out = client.run(model, payload, timeout=600, poll_interval=1.0, enable_sync_mode=False)

url = wavespeed.upload("/path/to/image.png")
```

Run with the dedicated venv:

```bash
~/.local/share/wavespeed-skill/venv/bin/python myscript.py
```

Or ad-hoc:

```bash
uv run --with wavespeed python myscript.py
```

## Frequently-used model uuids

| Family | uuid |
|---|---|
| Text→Image fast | `wavespeed-ai/z-image/turbo` |
| Text→Image quality | `wavespeed-ai/flux-dev`, `wavespeed-ai/flux-pro`, `wavespeed-ai/qwen-image-2` |
| Text→Image w/ LoRA | `wavespeed-ai/flux-dev-lora` |
| Image→Video | `wavespeed-ai/seedance-v2`, `wavespeed-ai/kling-v2.1`, `wavespeed-ai/luma-dream-machine` |
| Text→Video | `wavespeed-ai/veo-3`, `wavespeed-ai/veo-3-fast`, `wavespeed-ai/wan-2.7` |
| Identity portrait | `wavespeed-ai/higgsfield-soul-id` |
| Audio | `wavespeed-ai/ace-step` |
| LLM | `anthropic/claude-opus-4.6`, `openai/gpt-5.2-pro`, `google/gemini-3-flash-preview`, `deepseek/deepseek-v4`, `meta-llama/llama-4-70b` |

Live catalog: `wavespeed-cli models --names-only`.

## REST primitives (when SDK is overkill)

```bash
# Submit
curl -X POST "https://api.wavespeed.ai/api/v3/<model_uuid>" \
  -H "Authorization: Bearer $WAVESPEED_API_KEY" -H "Content-Type: application/json" \
  -d '{...payload...}'

# Poll
curl "https://api.wavespeed.ai/api/v3/predictions/<id>/result" \
  -H "Authorization: Bearer $WAVESPEED_API_KEY"
```

Errors: `401` bad key, `429` rate limit, `400` payload mismatch, `402` insufficient balance.

## Cost / latency knobs

- `--timeout 600` image, `--timeout 1800` video. Default `36000` is too long for interactive flows.
- `--poll-interval 0.5` for fast image loops; default `1.0` is fine for video.
- `--sync` skips polling — only for sub-30s models.

## Refs

- Docs: https://wavespeed.ai/docs
- SDK: https://github.com/WaveSpeedAI/wavespeed-python
- Models: https://wavespeed.ai/models
- API key: https://wavespeed.ai/accesskey
- Skill repo: https://github.com/wesleysimplicio/WaveSpeedAI-Skills
