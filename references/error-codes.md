# Error codes

WaveSpeed returns standard HTTP status codes, with a JSON envelope that mirrors the status:

```json
{ "code": 400, "message": "human-readable detail", "data": null }
```

| Status | Meaning | Action |
|---|---|---|
| `200` | success | proceed |
| `400` | payload schema mismatch / unsupported field | open the model page, fix params |
| `401` | API key missing or invalid | re-issue at https://wavespeed.ai/accesskey |
| `402` | insufficient balance / tier-locked model | top up or pick another model |
| `403` | content policy violation | rephrase prompt, drop blocked imagery |
| `404` | model uuid or task id not found | double-check the uuid spelling |
| `409` | duplicate request id | regenerate idempotency key |
| `413` | upload too large | split file, use chunked upload |
| `415` | unsupported file type | re-encode (png/jpg/webp/mp4/mp3) |
| `422` | semantic input error (e.g. empty prompt) | validate before submit |
| `429` | rate-limited | back off; respect `Retry-After` |
| `500` / `502` / `503` | upstream / platform error | retry idempotent submits |
| `504` | upstream timeout | retry; lower duration / quality settings |

## SDK exception types

The Python SDK raises:

- `wavespeed.exceptions.WaveSpeedError` — base class.
- `wavespeed.exceptions.AuthenticationError` — 401.
- `wavespeed.exceptions.RateLimitError` — 429. Has `retry_after` attribute.
- `wavespeed.exceptions.PredictionFailedError` — terminal `failed` status.
- `wavespeed.exceptions.TimeoutError` — `timeout` exceeded during polling.

## Defensive pattern

```python
import time, wavespeed
from wavespeed.exceptions import RateLimitError, WaveSpeedError

def safe_run(model, payload, attempts=3):
    delay = 1.0
    for i in range(attempts):
        try:
            return wavespeed.run(model, payload, timeout=600)
        except RateLimitError as e:
            time.sleep(getattr(e, "retry_after", delay))
            delay *= 2
        except WaveSpeedError:
            if i == attempts - 1:
                raise
            time.sleep(delay)
            delay *= 2
```
