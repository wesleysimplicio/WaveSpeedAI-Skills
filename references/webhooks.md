# Webhooks reference

For long-running predictions (video, training, large LoRA fits), pass a `webhook_url` on submit and let WaveSpeed call you back when the prediction reaches a terminal state. Don't park a polling loop for a 5-minute job.

## Configuring

Two options:

1. **Per-request**: include `"webhook_url": "https://..."` in the submit body.
2. **Default for the account**: set a default URL in your dashboard. Per-request still wins.

Configure the **shared secret** in the dashboard. WaveSpeed uses it to sign the body. Treat it like an API key.

## Delivery

WaveSpeed POSTs JSON to your URL with these headers (names approximate; verify against current docs):

| Header | Purpose |
|---|---|
| `Content-Type: application/json` | body format |
| `X-Webhook-Signature: sha256=…` | HMAC-SHA256 of raw body using shared secret |
| `X-Webhook-Event: prediction.completed` | event type |
| `X-Webhook-Delivery: <uuid>` | unique delivery id (deduplication key) |

Body shape (terminal):

```json
{
  "id": "pred_01HZ...",
  "model": "wavespeed-ai/veo-3",
  "status": "completed",
  "outputs": ["https://wavespeed-cdn.../result.mp4"],
  "error": null,
  "created_at": "2026-05-06T12:00:00Z",
  "completed_at": "2026-05-06T12:01:53Z"
}
```

Failure body has `"status": "failed"` and a populated `error` field.

## Verification

The signature is HMAC-SHA256 over the **raw body bytes** (don't re-serialize parsed JSON; whitespace and key order matter):

```
expected = HMAC_SHA256(secret, raw_body).hex()
received = X-Webhook-Signature header (strip optional "sha256=" prefix)
valid    = constant_time_compare(expected, received)
```

The CLI exposes this as:

```bash
WAVESPEED_WEBHOOK_SECRET=ws_secret \
  wavespeed-cli verify-webhook "$RAW_BODY" "$X_WEBHOOK_SIGNATURE"
```

## Retry policy

Non-2xx responses trigger retries with exponential backoff (typically 5 attempts over ~24h). Your endpoint **must be idempotent** — the same prediction can be delivered more than once. Dedup by `id` or by `X-Webhook-Delivery`.

Aim to ack in <5s. Push slow work onto a queue and respond `204 No Content` immediately.

## Local development

Use a tunnel to expose `localhost`:

```bash
ngrok http 5000
# or
cloudflared tunnel --url http://localhost:5000
```

Use the printed HTTPS URL as `webhook_url`.

## Common bugs

- **Signature mismatch**: you parsed the JSON before hashing. Hash the raw bytes. In Express: `app.use(bodyParser.raw({ type: 'application/json' }))`.
- **Multiple deliveries**: your handler isn't idempotent. Upsert by `prediction.id`.
- **Webhook never fires**: prediction didn't reach terminal status (still `processing`, or stuck). Check with `wavespeed-cli result <id>`.
- **Signature optional?** No — always verify in production. Anyone with your webhook URL could forge calls otherwise.
