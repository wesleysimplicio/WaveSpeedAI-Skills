# Webhooks

For long-running jobs (video, large LoRA training), don't hold an HTTP socket open. Submit with a `webhook_url` and let WaveSpeed call you back.

## Submit with webhook

```bash
wavespeed-cli submit wavespeed-ai/veo-3 '{"prompt":"..."}' \
  --webhook-url https://your.app/wavespeed/callback
# → {"data":{"id":"pred_abc123","status":"created"}}
```

Or in Python:

```python
import wavespeed
job = wavespeed.run_async(
    "wavespeed-ai/veo-3",
    {"prompt": "..."},
    webhook_url="https://your.app/wavespeed/callback",
)
```

## Payload shape

WaveSpeed POSTs a JSON body to your URL when the prediction reaches a terminal state. Approximate envelope:

```json
{
  "id": "pred_abc123",
  "model": "wavespeed-ai/veo-3",
  "status": "completed",
  "outputs": ["https://wavespeed-cdn.../result.mp4"],
  "error": null,
  "created_at": "2026-05-06T12:00:00Z",
  "completed_at": "2026-05-06T12:01:53Z"
}
```

## Verify the signature

WaveSpeed signs the raw request body with HMAC-SHA256, using a shared secret you configure in your account dashboard. The signature is delivered in the `X-Webhook-Signature` header (sometimes prefixed with `sha256=`).

### Python (Flask example)

```python
import hashlib, hmac, os
from flask import Flask, request, abort

WS_SECRET = os.environ["WAVESPEED_WEBHOOK_SECRET"].encode()
app = Flask(__name__)

@app.post("/wavespeed/callback")
def cb():
    raw = request.get_data()  # raw bytes — never the parsed json
    received = request.headers.get("X-Webhook-Signature", "").removeprefix("sha256=")
    expected = hmac.new(WS_SECRET, raw, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, received):
        abort(401)
    payload = request.get_json()
    # ... handle payload
    return ("", 204)
```

### Bash (CLI helper)

```bash
WAVESPEED_WEBHOOK_SECRET=ws_secret \
  wavespeed-cli verify-webhook "$(cat body.json)" "$X_WEBHOOK_SIGNATURE"
# prints "valid" or "invalid", exits 0 / 1 accordingly
```

## Retry policy

If your endpoint returns a non-2xx response, WaveSpeed retries with exponential backoff. Endpoint should be idempotent — your handler may be invoked twice for the same prediction.

Keep the handler fast (<5s). Push slow work onto a queue and ack immediately.

## Local development

Expose your local server with `cloudflared tunnel`, `ngrok`, or `bore.pub`:

```bash
ngrok http 5000
# use the printed https URL as --webhook-url
```

## Troubleshooting

- `signature invalid` → make sure you're hashing the **raw** body, not a re-serialized JSON. Flask: `request.get_data()`. Express: enable `bodyParser.raw({type:'application/json'})`.
- `webhook never fires` → check that the prediction actually reached a terminal state. `wavespeed-cli result <id>` to inspect.
- `multiple deliveries` → that's expected. Make the handler idempotent (e.g., upsert by `prediction.id`).
