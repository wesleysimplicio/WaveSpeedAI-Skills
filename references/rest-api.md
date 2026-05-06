# REST API reference

Base: `https://api.wavespeed.ai/api/v3`
Auth: `Authorization: Bearer $WAVESPEED_API_KEY`
Content type for body: `application/json` (uploads use `multipart/form-data`).

## Submit a prediction

```http
POST /api/v3/{model_uuid}
Authorization: Bearer ws_...
Content-Type: application/json

{
  "prompt": "Cat in tuxedo",
  "size": "1024x1024",
  "webhook_url": "https://your.app/cb"      // optional
}
```

Response:

```json
{
  "code": 200,
  "message": "ok",
  "data": {
    "id": "pred_01HZ...",
    "model": "wavespeed-ai/z-image/turbo",
    "status": "created",
    "created_at": "2026-05-06T12:00:00Z"
  }
}
```

## Get a prediction result

```http
GET /api/v3/predictions/{id}/result
Authorization: Bearer ws_...
```

Response (terminal):

```json
{
  "code": 200,
  "data": {
    "id": "pred_01HZ...",
    "model": "wavespeed-ai/z-image/turbo",
    "status": "completed",
    "outputs": ["https://wavespeed-cdn.../out.png"],
    "error": null,
    "created_at": "2026-05-06T12:00:00Z",
    "completed_at": "2026-05-06T12:00:02Z"
  }
}
```

Status enum (observed): `created` · `processing` · `completed` · `failed` · `canceled`.

## Cancel / delete a prediction

```http
DELETE /api/v3/predictions/{id}
Authorization: Bearer ws_...
```

Best-effort. Already-running tasks may still bill.

## Sync mode

Append `?sync=1` to the submit URL, or pass `enable_sync_mode=true` via the SDK. The HTTP socket stays open until the prediction is terminal. Only worth it for sub-30s models, since LB timeouts kick in around 60s on most paths.

## List models

```http
GET /api/v3/models
Authorization: Bearer ws_...
```

Response: array of model entries with `id`, `family`, `type`, pricing hints.

## Account balance

```http
GET /api/v3/account/balance
Authorization: Bearer ws_...
```

(Some accounts expose `/api/v3/balance`. The CLI tries both.)

## Upload a file

```http
POST /api/v3/uploads
Authorization: Bearer ws_...
Content-Type: multipart/form-data

file=@./input.png
```

Response includes a hosted URL. Use that URL as the `image` / `video` / `audio` field on subsequent submits. Large files: chunked uploads supported by the SDK.

## LLM (OpenAI-compatible)

Different host: `https://llm.wavespeed.ai/v1`. Same auth. Endpoints follow the OpenAI Chat Completions protocol exactly:

- `POST /chat/completions`
- `POST /embeddings`
- `GET /models`

Streaming uses Server-Sent Events with `data:` framing and a `[DONE]` sentinel.

## Errors

Error responses use the same envelope:

```json
{ "code": 400, "message": "invalid prompt", "data": null }
```

See `references/error-codes.md` for the full mapping.

## Rate limits

Tier-based, returned in `X-RateLimit-*` response headers when present. See `references/rate-limits.md`.
