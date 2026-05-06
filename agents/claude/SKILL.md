---
name: wavespeed
description: |
  Generate images, video, audio and avatars via the WaveSpeedAI inference platform (700+ models incl. FLUX, Kling, Veo, Luma, Stable Diffusion, Seedance, Z-Image, Wan, Qwen, Higgsfield), or call the OpenAI-compatible LLM gateway (290+ models incl. Claude, GPT, Gemini, DeepSeek, Llama, Mistral). Use whenever the user asks to create AI media, run a `wavespeed-ai/*` model, upload a media asset for inference, list available models, check account balance, configure a webhook, or call an LLM through the WaveSpeed proxy. Wraps the official Python SDK (`pip install wavespeed`) plus a thin CLI for one-shot calls.
allowed-tools:
  - Bash(wavespeed-cli *)
  - Bash(~/.local/bin/wavespeed-cli *)
  - Bash(~/.local/share/wavespeed-skill/venv/bin/python *)
---

# WaveSpeedAI

Unified inference gateway. Async-by-default with automatic polling. One API key, one client, image + video + audio + LLM all in the same surface.

## When to use

- User asks to generate an image, video, audio clip or avatar via WaveSpeed.
- User mentions a `wavespeed-ai/*` model uuid or `vendor/model` LLM id.
- User wants to upload a local image/video to use as input for image-to-X models.
- User wants to call Claude / GPT / Gemini / Llama through the WaveSpeed LLM proxy.
- User wants to list models, check balance, or configure a webhook.

## When NOT to use

- ComfyUI graph workflows → use a `comfyui` skill.
- Direct OpenAI / Anthropic API calls bypassing WaveSpeed → use the vendor SDK directly.
- Local-only generation (Stable Diffusion on disk) → out of scope.

## Prereqs

```bash
export WAVESPEED_API_KEY="ws_..."     # https://wavespeed.ai/accesskey
```

CLI lives at `~/.local/bin/wavespeed-cli` (uses isolated venv at `~/.local/share/wavespeed-skill/venv`). If missing, run the installer from `https://github.com/wesleysimplicio/WaveSpeedAI-Skills`.

## Quick reference

### Generate media (async + poll, default)

```bash
# Text → image (Z-Image turbo, fastest)
wavespeed-cli run wavespeed-ai/z-image/turbo '{"prompt":"Cat in a tuxedo"}'

# Text → image with output format and size
wavespeed-cli run wavespeed-ai/flux-dev '{"prompt":"Octopus chess","output_format":"png","size":"1024x1024"}'

# Image → video (upload local image first, then pass URL)
URL=$(wavespeed-cli upload ./input.png)
wavespeed-cli run wavespeed-ai/seedance-v2 \
  "$(jq -nc --arg u "$URL" '{image:$u, prompt:"camera dolly in"}')"
```

Output URLs live at `.outputs[]` of the printed JSON.

### Submit-only / fire-and-forget with webhook

```bash
wavespeed-cli submit wavespeed-ai/veo-3 '{"prompt":"thunderstorm at dusk"}' \
  --webhook-url https://your.app/wavespeed/callback
# → prints {"data":{"id":"...","status":"created"}}
wavespeed-cli result <task_id> --wait
```

### Sync mode (single request, no polling)

```bash
wavespeed-cli run wavespeed-ai/z-image/turbo '{"prompt":"Cat"}' --sync
```

Only worth it for sub-30s models.

### Upload, models, balance

```bash
wavespeed-cli upload /path/to/image.png    # prints hosted URL
wavespeed-cli models --names-only          # list every model id
wavespeed-cli models --filter video        # JSON, filtered by substring
wavespeed-cli balance                      # account credit
```

### LLM (OpenAI-compatible)

```bash
wavespeed-cli llm anthropic/claude-opus-4.6 "Summarize WaveSpeed in one line"
wavespeed-cli llm openai/gpt-5.2-pro "Hello" --system "You are terse."
wavespeed-cli llm google/gemini-3-flash-preview '{"city":"Lisbon"}' --json-mode
wavespeed-cli llm deepseek/deepseek-v4 "..." --stream
wavespeed-cli llm meta-llama/llama-4-70b "..." --raw     # full JSON
```

Base URL: `https://llm.wavespeed.ai/v1` — every existing OpenAI client works by swapping `base_url` and `api_key`.

### Webhooks

```bash
echo -n "$RAW_BODY" | \
  wavespeed-cli verify-webhook - "$X_WEBHOOK_SIGNATURE"
# uses WAVESPEED_WEBHOOK_SECRET env var
```

## Python SDK (when scripting)

```python
import wavespeed

out = wavespeed.run("wavespeed-ai/z-image/turbo", {"prompt": "Cat"})
print(out["outputs"][0])

# Tuning
out = wavespeed.run(model, payload, timeout=600.0, poll_interval=0.5, enable_sync_mode=False)

# Explicit client (custom retries)
from wavespeed import Client
client = Client(api_key="...", max_retries=3, max_connection_retries=5, retry_interval=1.0)
out = client.run(model, payload)

# Upload
url = wavespeed.upload("/path/to/image.png")
```

Use the dedicated venv: `~/.local/share/wavespeed-skill/venv/bin/python script.py`. Or `uv run --with wavespeed python script.py` for a one-off.

## Model catalog (frequently used)

| Family | Example uuid | Use |
|---|---|---|
| Z-Image | `wavespeed-ai/z-image/turbo` | fast text→image |
| FLUX | `wavespeed-ai/flux-dev`, `wavespeed-ai/flux-pro` | high-quality text→image |
| FLUX LoRA | `wavespeed-ai/flux-dev-lora` | text→image with LoRAs |
| Seedance | `wavespeed-ai/seedance-v2` | image→video |
| Kling | `wavespeed-ai/kling-v2.1` | image/text→video |
| Veo | `wavespeed-ai/veo-3`, `wavespeed-ai/veo-3-fast` | text→video w/ audio |
| Luma | `wavespeed-ai/luma-dream-machine` | text/image→video |
| Wan | `wavespeed-ai/wan-2.7` | text→video |
| Qwen | `wavespeed-ai/qwen-image-2` | text→image |
| Higgsfield | `wavespeed-ai/higgsfield-soul-id` | identity-preserving portrait |
| Audio | `wavespeed-ai/ace-step` | audio gen / edit |
| LLM | `anthropic/claude-opus-4.6`, `openai/gpt-5.2-pro`, `google/gemini-3-flash-preview` | chat |

`wavespeed-cli models --names-only` for the live catalog.

## Latency / cost knobs

- `--timeout 600` for image, `--timeout 1800` for video. Don't leave the default 36000.
- `--poll-interval 0.5` for fast image loops; `1.0` is fine for video.
- `--sync` skips polling; only viable for sub-30s models.

## Error codes

- `401` — API key missing or revoked.
- `400` — payload doesn't match model schema (open the model page).
- `402` — insufficient balance / tier locked.
- `404` — task or model not found.
- `429` — rate-limited; back off (`retry_interval` in the SDK).
- `500/502/503` — upstream error; retry idempotent submits.

## References

- Docs: https://wavespeed.ai/docs
- Python SDK: https://github.com/WaveSpeedAI/wavespeed-python
- JS SDK: https://github.com/WaveSpeedAI/wavespeed-javascript
- API key: https://wavespeed.ai/accesskey
- Models catalog: https://wavespeed.ai/models
- API base: `https://api.wavespeed.ai/api/v3`
- LLM base: `https://llm.wavespeed.ai/v1`
- Skill repo: https://github.com/wesleysimplicio/WaveSpeedAI-Skills
