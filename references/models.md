# Model catalog (curated)

This is the curated short list of models the skill suggests by default. The full live catalog is always available with:

```bash
wavespeed-cli models --names-only
```

WaveSpeed has 700+ models across image, video, audio, 3D, and LLM. New entries land weekly. If something here is stale, file an issue.

## Text → image

| uuid | family | sweet spot |
|---|---|---|
| `wavespeed-ai/z-image/turbo` | Z-Image | thumbnails, A/B, fastest |
| `wavespeed-ai/z-image/base` | Z-Image | balance of speed and quality |
| `wavespeed-ai/flux-schnell` | FLUX | 4 steps, very fast, ok quality |
| `wavespeed-ai/flux-dev` | FLUX | default for marketing assets |
| `wavespeed-ai/flux-pro` | FLUX | flagship quality, slower |
| `wavespeed-ai/flux-2` | FLUX | newer FLUX iteration |
| `wavespeed-ai/qwen-image-2` | Qwen | text-rendering champion |
| `wavespeed-ai/seedream-4.5` | ByteDance | strong photorealism |
| `wavespeed-ai/imagen-4` | Google | tight prompt adherence |
| `wavespeed-ai/dall-e-3` | OpenAI | accessible classic |
| `wavespeed-ai/nano-banana-pro` | community | trendy fine-tune |

## Text → image w/ LoRA

| uuid | notes |
|---|---|
| `wavespeed-ai/flux-dev-lora` | accepts HF Hub LoRA paths |
| `wavespeed-ai/flux-pro-lora` | flagship + LoRA |
| `wavespeed-ai/z-image/lora` | Z-Image with LoRA support |

## Image → video

| uuid | duration | strengths |
|---|---|---|
| `wavespeed-ai/seedance-v2` | 5–10s | cinematic camera moves |
| `wavespeed-ai/kling-v2.1` | 5s | versatile, good with people |
| `wavespeed-ai/kling-v2.6-pro` | 10s | top-tier humans + fabrics |
| `wavespeed-ai/luma-dream-machine` | 5s | dreamlike, soft motion |
| `wavespeed-ai/pixverse-v4.5` | 5–8s | stylized, anime-friendly |
| `wavespeed-ai/vidu-q1` | 4s | low-cost first pass |
| `wavespeed-ai/runway-gen-3` | 5–10s | flagship |

## Text → video

| uuid | audio | notes |
|---|---|---|
| `wavespeed-ai/veo-3` | yes | flagship Google |
| `wavespeed-ai/veo-3-fast` | yes | half-cost, faster |
| `wavespeed-ai/veo-3.1` | yes | newer iteration |
| `wavespeed-ai/sora-2` | yes (limited) | OpenAI Sora |
| `wavespeed-ai/wan-2.7` | no | Alibaba flagship text→video |
| `wavespeed-ai/dreamina` | no | ByteDance text/image→video |
| `wavespeed-ai/hailuo-02` | no | Minimax Hailuo |

## Identity / portrait

| uuid | notes |
|---|---|
| `wavespeed-ai/higgsfield-soul-id` | strong likeness preservation |
| `wavespeed-ai/avatar-omni` | digital humans, lipsync |
| `wavespeed-ai/kling-lipsync` | drive a portrait with audio |

## Audio

| uuid | use |
|---|---|
| `wavespeed-ai/ace-step` | music + SFX gen and edit |
| `wavespeed-ai/elevenlabs-tts` | TTS proxy |
| `wavespeed-ai/qwen3-tts` | multilingual TTS |
| `wavespeed-ai/omnivoice` | voice cloning |
| `wavespeed-ai/minimax-music` | music gen |

## 3D

| uuid | use |
|---|---|
| `wavespeed-ai/hunyuan-3d-2.5` | image → 3D mesh |
| `wavespeed-ai/tripo3d-v2` | image → 3D mesh |
| `wavespeed-ai/meshy-6` | text/image → 3D |

## Video / image effects

`wavespeed-cli models --filter effect` — there are 100+ short-form effect templates (swap-style, grow-from-egg, etc.) that take a single image and ship a 3-5s clip.

## LLMs (290+)

| uuid prefix | examples |
|---|---|
| `anthropic/` | `claude-opus-4.6`, `claude-sonnet-4.6`, `claude-haiku-4.5` |
| `openai/` | `gpt-5.2-pro`, `gpt-5.2-mini`, `gpt-5-vision` |
| `google/` | `gemini-3-pro`, `gemini-3-flash-preview`, `gemini-3-flash-thinking` |
| `meta-llama/` | `llama-4-70b`, `llama-4-405b` |
| `deepseek/` | `deepseek-v4`, `deepseek-r2` |
| `mistral/` | `mistral-large-3`, `mixtral-8x22b-2` |
| `qwen/` | `qwen-3-72b`, `qwen-3-coder-instruct` |
| `xai/` | `grok-4`, `grok-4-fast` |
| `cohere/` | `command-r-plus-2` |

The LLM list is volatile. Run `wavespeed-cli models --filter anthropic` (or any vendor) for the current set.

## How to pick

- **Image, fast iteration** → `z-image/turbo`. Switch to `flux-dev` once the prompt is locked in.
- **Image, hero asset** → `flux-pro` or `seedream-4.5` (more photoreal).
- **Image with text in it** → `qwen-image-2`. FLUX struggles here.
- **Image → video, person** → `kling-v2.6-pro`.
- **Image → video, scene** → `seedance-v2`.
- **Text → video w/ audio** → `veo-3` for hero, `veo-3-fast` for drafts.
- **LLM, smartest** → `anthropic/claude-opus-4.6` or `openai/gpt-5.2-pro`.
- **LLM, cheapest decent** → `deepseek/deepseek-v4` or `google/gemini-3-flash-preview`.
