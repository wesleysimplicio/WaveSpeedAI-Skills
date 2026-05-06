# Serverless worker

Host your own model on WaveSpeed's serverless GPU platform. Same `wavespeed.serverless` SDK that runs locally for tests runs in production unchanged.

## Minimal handler

```python
# handler.py
import wavespeed.serverless as serverless

def handler(job):
    prompt = job["input"]["prompt"]
    return {"output": prompt.upper()}

serverless.start({"handler": handler})
```

## Async handler (preferred for I/O-bound work)

```python
import aiohttp
import wavespeed.serverless as serverless

async def handler(job):
    url = job["input"]["url"]
    async with aiohttp.ClientSession() as s:
        async with s.get(url) as r:
            text = await r.text()
    return {"chars": len(text)}

serverless.start({"handler": handler})
```

## Generator handler (stream partials)

```python
def handler(job):
    for i in range(10):
        yield {"progress": i / 10, "partial": f"chunk-{i}"}

serverless.start({"handler": handler})
```

## Input validation

```python
from wavespeed.serverless.utils import validate

INPUT_SCHEMA = {
    "prompt":      {"type": str,   "required": True},
    "max_tokens":  {"type": int,   "required": False, "default": 100},
    "temperature": {"type": float, "required": False, "default": 0.7,
                    "constraints": lambda x: 0 <= x <= 2},
}

def handler(job):
    res = validate(job["input"], INPUT_SCHEMA)
    if "errors" in res:
        return {"error": res["errors"]}
    inp = res["validated_input"]
    # ... do work with inp
    return {"output": "done"}
```

## Concurrency control

```python
def concurrency_modifier(current_concurrency: int) -> int:
    return min(4, current_concurrency + 1)

serverless.start({"handler": handler, "concurrency_modifier": concurrency_modifier})
```

## Local testing

```bash
# One-shot
python handler.py --test_input '{"input":{"prompt":"hello"}}'

# Local FastAPI server, mimicking the hosted runtime
python handler.py --waverless_serve_api --waverless_api_port 8000
```

## Worker environment variables

| Var | Set by | Purpose |
|---|---|---|
| `WAVERLESS_POD_ID` | platform | identifies this worker pod |
| `WAVERLESS_API_KEY` | platform | per-worker auth |
| `WAVERLESS_WEBHOOK_GET_JOB` | platform | URL to long-poll for jobs |
| `WAVERLESS_WEBHOOK_POST_OUTPUT` | platform | URL to deliver results |

You set none of these in production — the platform injects them. For local tests, the `--test_input` flag bypasses them.

## When to deploy serverless vs. just call a model

- **Call a model**: 700+ already-hosted models cover most needs.
- **Deploy serverless**: you have a fine-tune, a multi-step pipeline (e.g., upscale + caption + classify), or a wrapper that combines two providers.
